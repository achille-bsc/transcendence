/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gamesHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/29 16:27:36 by marvin            #+#    #+#             */
/*   Updated: 2026/02/26 23:21:32 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { games, GRAVITY, JUMP_FORCE, kongMaxHeight, MOVE_SPEED, persoKongHeight }	from "../utils/const";
import { ClientState, Game, Difficults }											from "../utils/types";
import { generateKongMap, getPlatformYAtX }											from "./kongMap";
import { sleep }																	from "../utils/utils";


export function handleGame(state: ClientState, datas:
	[
		"createGame"
		| "joinGame"
		| "jump"
		| "goLeft"
		| "goRight",
		string,
		Difficults,
	]
): void
{
	if (!state.gameId)
	{
		console.log(`player ${state.id} is trying to create a game with difficulty ${datas[2]}`);
		return ;
	}
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
	if (!player || player.isJumping || !player.isOnGround)
		return;
	
	player.isJumping = true;
	player.isOnGround = false;
	player.velocityY = JUMP_FORCE;
}

function goLeft(game: Game, playerId: string): void
{
	console.log(`Player ${playerId} is trying to go left in game hosted by ${game.host}`);
	const player = game.players.get(playerId);
	if (!player)
		return ;
	player.isGoingLeft = true;
	// game.players.delete(playerId);
	// game.players.set(playerId, player);
}

function goRight(game: Game, playerId: string): void
{
	const player = game.players.get(playerId);
	if (!player)
		return ;
	player.isGoingRight = true;
	// game.players.delete(playerId);
	// game.players.set(playerId, player);
}


export function startGame(game: Game)
{
	// map de 5 etages
	game.map = generateKongMap(5);

	game.players.forEach((player) => {
		console.log(`Initializing player ${player.id} in game hosted by ${game.host}`);
		player.x = game.map!.spawnPoint.x;
		player.y = game.map!.spawnPoint.y;
		player.velocityY = 0;
		player.isOnGround = false;
	});

	console.log(`Starting game hosted by ${game.host}`);
	console.log(`Map generated with ${game.map.platforms.length} platforms`);
	game.isStarted = true;
	sendGameState(game, true);
	gameLoop(game);
}

async function gameLoop(game: Game)
{
	let frameCount = 0;

	while (!game.isFinish && game.isStarted) {
		game = games.get(game.id.toString())!;
		if (!game || !game.map)
			break;

		game.players.forEach((player) => {
			if (player.isGoingLeft) {
				player.x -= MOVE_SPEED;
				player.isGoingLeft = false;
			}
			if (player.isGoingRight) {
				player.x += MOVE_SPEED;
				player.isGoingRight = false;
			}
			player.x = Math.max(80, Math.min(player.x, game.map!.platforms[0]!.endX));
		});

		handleGamePhysics(game);
		frameCount++;
		await sleep(100);
		sendGameState(game);
	}
}

function sendGameState(game: Game, includeMap: boolean = false)
{
	const mapData = (includeMap && game.map) ? {
		platforms: game.map.platforms,
		spawnPoint: game.map.spawnPoint,
		goalPoint: game.map.goalPoint
	} : undefined;

	game.players.forEach((player) => {
		const playersData = Array.from(game.players.values()).map(p => ({
			id: p.id,
			x: p.x,
			y: p.y,
			isOnGround: p.isOnGround,
			isJumping: p.isJumping
		}));
		
		const message: any = {
			type: 'gameState',
			players: playersData
		};
		
		if (mapData) {
			message.map = mapData;
		}
		
		player.socket.send(JSON.stringify(message));
	});
}

function handleGamePhysics(game: Game)
{
	if (!game.map)
		return;

	game.players.forEach((player) => {
		player.velocityY += GRAVITY;
		player.y += player.velocityY;
		
		player.isOnGround = false;
		
		for (const platform of game.map!.platforms) {
			if (player.x < platform.startX || player.x > platform.endX)
				continue;

			const platformY = getPlatformYAtX(platform, player.x);
			const playerFeetY = player.y + persoKongHeight / 2;
			
			if (playerFeetY >= platformY && playerFeetY <= platformY + 15 && player.velocityY >= 0) {
				player.y = platformY - persoKongHeight / 2;
				player.velocityY = 0;
				player.isOnGround = true;
				player.isJumping = false;
				break;
			}
		}
		
		if (player.y > kongMaxHeight + 50) {
			player.x = game.map!.spawnPoint.x;
			player.y = game.map!.spawnPoint.y;
			player.velocityY = 0;
		}
	});
}
