/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gamesHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/29 16:27:36 by marvin            #+#    #+#             */
/*   Updated: 2026/01/26 08:19:22 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { ClientState, Game, Difficults } from "../utils/types";
import { games, kongMaxHeight, kongMaxLength, kongPlayerMaxSpeed, persoKongHeight, persoKongWidth } from "../utils/const";
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
			
			break;
	
		case 'goLeft':

			break;
		
		case 'goRight':
			goRight(game, state.id!);
			console.log(`Handled goRight for player ${state.id} in game ${state.gameId}`);
			break;
		default:
			break;
	}
}

function goRight(game: Game, playerId: string): void
{
	console.log(`Player ${playerId} is going right in game hosted by ${game.host}`);
	const player = game.players.get(playerId);
	if (!player)
		return ;
	player.x += 10;
	game.players.delete(playerId);
	game.players.set(playerId, player);
	games.delete(game.host);
	games.set(game.host, game);
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
		player.maxSpeed = kongPlayerMaxSpeed;
	});

	console.log(`Starting game hosted by ${game.host}`);
	// console.log(`Game is Finished: ${game.isFinish}`);
	game.isStarted = true;
	
	gameLoop(game);
}

async function gameLoop(game: Game)
{
	let oldPlayersData;
	while (!game.isFinish && game.isStarted) {
		game = games.get(game.host)!;
		// Players Movements => on verifie seulement que le perso sort pas de l'ecran
		// On rajmovementoutera les collisions une fois le concept de map etablis
		game.players.forEach((player) => {
			if (player.vSpeed != 0)
			{
				if (player.y + player.vSpeed > (kongMaxHeight - (persoKongHeight / 2)))
				{
					player.vSpeed = 0;``	
					player.y = (kongMaxHeight - (persoKongHeight / 2));
				}
				else if (player.y + player.vSpeed < (kongMaxHeight - (persoKongHeight / 2)))
				{
					player.vSpeed = 0;``	
					player.y = (kongMaxHeight - (persoKongHeight / 2));
				}
				else
				{
					player.y += player.vSpeed;
					player.vSpeed -= 1;
				}
			}
			if (player.hSpeed != 0)
			{
				if (player.x + player.hSpeed > (kongMaxLength - (persoKongWidth / 2)))
					player.x = (kongMaxLength - (persoKongWidth / 2));
				else
					player.x += player.hSpeed;
			}
		})
		await sleep(100);
		handleGamePhysics(game);
		const playersData = Array.from(game.players.values()).map(p => ({
			id: p.id,
			x: p.x,
			y: p.y,
			vSpeed: p.vSpeed,
			hSpeed: p.hSpeed,
			maxSpeed: p.maxSpeed,
		}));
		if (!oldPlayersData)
		{
			sendGameState(game);
			oldPlayersData = playersData;
		}
		
		if (checkDiffState(playersData, oldPlayersData))
			sendGameState(game);
		oldPlayersData = playersData
	}
}

function checkDiffState(
	playersData: {
		id: string;
		x: number;
		y: number;
		vSpeed: number;
		hSpeed: number;
	    maxSpeed: number;
	}[],
	oldPlayersData: {
		id: string;
		x: number;
		y: number;
		vSpeed: number;
		hSpeed: number;
	    maxSpeed: number;
	}[]
): boolean
{
	if (playersData.length !== oldPlayersData.length)
		return true;
	playersData.forEach((playerData, index) => {
		if (oldPlayersData[index])
		{
			if (
					playerData.x !== oldPlayersData[index].x
				||	playerData.y !== oldPlayersData[index].y
				||	playerData.vSpeed !== oldPlayersData[index].vSpeed
				||	playerData.hSpeed !== oldPlayersData[index].hSpeed
			)
				return true;
		}
	});
	return false;
}

function sendGameState(game: Game)
{
	console.log(`Sending game state to players in game hosted by ${game.host}`);
	game.players.forEach((player) => {
		// console.log(`Sending game state to player ${player.is} in game hosted by ${game.host}`);
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
