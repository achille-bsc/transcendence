/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gamesHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/29 16:27:36 by marvin            #+#    #+#             */
/*   Updated: 2026/01/26 13:43:57 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { ClientState, Game, Difficults } from "../utils/types";
import { games, kongMaxHeight, kongMaxLength, kongPlayerSpeed, persoKongHeight, persoKongWidth } from "../utils/const";
import { sleep } from "../utils/utils";


// Handle game actions from players
export function handleGame(state: ClientState, datas:
	[
		"createGame"
			| "joinGame"
			| "jump"
			| "goLeft"
			| "goRight",
		Difficults,
		string
	]
): void
{
	if (!state.gameId)
		return ;
	const game: Game | undefined = games.get(state.gameId);
	if (!game)
		return ;

	switch (datas[0]) {
		case 'jump':
			jump(game, state.id!);
			break;
	
		case 'goLeft':
			goLeft(game, state.id!);
			break;
		
		case 'goRight':
			goRight(game, state.id!);
			break;
		default:
			break;
	}
}

function jump(game: Game, playerId: string): void
{
	const player = game.players.get(playerId);
	if (!player || player.isJumping)
		return ;
	player.isJumping = true;
	player.y -= 55.0;
	setTimeout(() => {
		player.y += 55.0;
		player.isJumping = false;
	}, 1000);
	game.players.delete(playerId);
	game.players.set(playerId, player);
}

function goLeft(game: Game, playerId: string): void
{
	const player = game.players.get(playerId);
	if (!player)
		return ;
	player.x -= kongPlayerSpeed;
	game.players.delete(playerId);
	game.players.set(playerId, player);
}

function goRight(game: Game, playerId: string): void
{
	const player = game.players.get(playerId);
	if (!player)
		return ;
	player.x += kongPlayerSpeed;
	game.players.delete(playerId);
	game.players.set(playerId, player);
}


export function startGame(game: Game)
{
	// initiate the players values when they are added to the game
	// but it stay here for now
	game.players.forEach((player) => {
		console.log(`Initializing player ${player.id} in game hosted by ${game.host}`);
		player.x = persoKongWidth	/ 2;
		player.y = persoKongHeight	/ 2;
		player.vSpeed = 0.0;
		player.hSpeed = 0.0;
		player.maxSpeed = kongPlayerSpeed;
	});

	console.log(`Starting game hosted by ${game.host}`);
	// console.log(`Game is Finished: ${game.isFinish}`);
	game.isStarted = true;
	sendGameState(game);
	gameLoop(game);
}

async function gameLoop(game: Game)
{
	let oldGame: Game = game;
	while (!game.isFinish && game.isStarted) {
		game = games.get(game.host)!;
		// Players Movements => on verifie seulement que le perso sort pas de l'ecran
		// On rajmovementoutera les collisions une fois le concept de map etablis
		game.players.forEach((player) => {
			// Gravity
			if (player.y < 510 && player.isJumping !== true)
				player.y = player.y + 15 > 510 ? 510 : player.y + 15;
		})
		await sleep(100);
		handleGamePhysics(game);
		
	
		if (checkDiffState(game, oldGame ? oldGame : game))
			sendGameState(game);
		oldGame = {
			...game,
			players: new Map(Array.from(game.players.entries()).map(([id, player]) => [id, { ...player }]))
		};
	}
}

function checkDiffState(game: Game, oldGame: Game): boolean
{
	let isDifferent = false;
	game.players.forEach((player, id) => {
		const oldPlayer = oldGame.players.get(id);
		if (!oldPlayer)
			isDifferent = true;
		else if (player.x !== oldPlayer.x || player.y !== oldPlayer.y
			|| player.vSpeed !== oldPlayer.vSpeed || player.hSpeed !== oldPlayer.hSpeed)
			isDifferent = true;
	});
	return isDifferent;
}

function sendGameState(game: Game)
{
	game.players.forEach((player) => {
		const playersData = Array.from(game.players.values()).map(p => ({
			id: p.id,
			x: p.x,
			y: p.y,
			vSpeed: p.vSpeed,
			hSpeed: p.hSpeed,
			maxSpeed: p.maxSpeed,
		}));
		player.socket.send(JSON.stringify(playersData));
	});
}

function handleGamePhysics(game: Game)
{
	game.players.forEach((player) => {
		if (player.y + player.vSpeed / 10 <= (kongMaxHeight - persoKongHeight / 2))
			player.y += player.vSpeed / 10;
		else
			player.y = kongMaxHeight - persoKongHeight / 2
		
		if (player.x + player.hSpeed /10 <= (kongMaxLength - persoKongWidth / 2))
			player.x += player.hSpeed / 10;
		else
			player.x = kongMaxLength - persoKongWidth / 2;
	})
}
