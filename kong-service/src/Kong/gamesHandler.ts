/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gamesHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jguelen <jguelen@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/29 16:27:36 by marvin            #+#    #+#             */
/*   Updated: 2026/03/10 10:25:56 by jguelen          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { 
	BARREL_FALL_SPEED,
	BARREL_HALF_SIZE,
	PLAYER_HALF_W,
	PLAYER_HALF_H,
	DIST_FOR_WIN,
	games,
	GRAVITY,
	IMMOBILIZED_TIME,
	JUMP_FORCE,
	kongMaxHeight,
	kongMaxLength,
	MOVE_SPEED,
	persoKongHeight,
	persoKongWidth,
	SECONDS_BEFORE_START
}								from "../utils/const";
import {
	ClientState,
	Game,
	Difficults,
	KongGameState,
	PlayerDatas
}	from "../utils/types";
import { MAP, getPlatformYAtX }	from "./kongMap";
import { sleep }				from "../utils/utils";
import { randomInt }			from "crypto";

export function handleGame(state: ClientState, datas:
	[
		"createGame"
		| "joinGame"
		| "jump"
		| "goLeft"
		| "goRight"
		| "goDown"
		| "startGame",
		string,
		Difficults,
		"local" | "online"
	],
	localUser: {
		id: string,
	}
): void
{
	// if (!state.gameId)
	// {
	// 	console.log(`player ${state.id} is trying to create a game with difficulty ${datas[2]}`);
	// 	return ;
	// }
	const game: Game | undefined = games.get(state.gameId!);
	if (!game)
		return ;
	else
	{
		switch (datas[0]) {
			case 'jump':
				jump(game, state.id!, localUser);
				break;
		
			case 'goLeft':
				goLeft(game, state.id!, localUser);
				break;
			
			case 'goRight':
				goRight(game, state.id!, localUser);
				break;
				
			case 'goDown':
				goDown(game, state.id!, localUser);
				break;
	
			default:
				break;
		}
	}
}

function jump(game: Game, playerId: string, localUser: { id: string }): void
{
	const player = game.players.get(game.isLocal ? localUser.id : playerId);
	if (!player || player.isJumping || player.isGoingSpawn/*|| !player.isOnGround*/)
			return;
	player.isJumping = true;
	player.isOnGround = false;
	player.velocityY = JUMP_FORCE;
}

function goLeft(game: Game, playerId: string, localUser: { id: string }): void
{
	const player = game.players.get(game.isLocal ? localUser.id : playerId);
	if (!player || player.isGoingSpawn)
		return ;
	player.isGoingLeft = true;
}

function goRight(game: Game, playerId: string, localUser: { id: string }): void
{
	const player = game.players.get(game.isLocal ? localUser.id : playerId);
	if (!player || player.isGoingSpawn)
		return ;
	player.isGoingRight = true;
}

function goDown(game: Game, playerId: string, localUser: { id: string }): void
{
	const player = game.players.get(game.isLocal ? localUser.id : playerId);
	if (!player || !player.isOnGround || !game.map || player.isGoingSpawn)
		return ;
	if (player.x > 150 && player.x < game.map.platforms[0]!.endX - 150)
		return ;
	player.isGoingDown = true;
}

export function startGame(game: Game)
{
	// map de 5 etages
	game.map = MAP;
	game.players.forEach((player) => {
		player.x = game.map?.spawnPoint.x || 1000;
		player.y = game.map?.spawnPoint.y || 1000;
		player.velocityY = 0;
		player.isOnGround = false;
	});

	sendGameState(game, true);
	gameLoop(game);
	setTimeout(() => {
		game.isStarted = true;
	}, SECONDS_BEFORE_START * 1000);
}


async function gameLoop(game: Game)
{
	let frameBeforeBaril = 20;
	let frameCount = 0;

	while (!game.isFinish) {
		if (game.isStarted) {
			game = games.get(game.id.toString())!;
			if (!game || !game.map)
				break;

			game.players.forEach((player) => {
				if (player.isGoingLeft) {
					let i = 0;
					while (i < 6)
					{
						player.x -= MOVE_SPEED;
						player.isGoingLeft = false;
						checkPlayerCollisionsWithBarils(player, game);
						i++;
					}
				}
				if (player.isGoingRight) {
					let i = 0;
					while (i < 6)
					{
						player.x += MOVE_SPEED;
						player.isGoingRight = false;
						checkPlayerCollisionsWithBarils(player, game);
						i++;
					}
				}
				player.x = Math.max(persoKongWidth / 2, Math.min(player.x, kongMaxLength - persoKongWidth / 2));
			});
		}
		
		await sleep(50);
		frameCount++;
		if (frameCount >= frameBeforeBaril || randomInt(0, 1000) < 10) {
			frameCount = 0;
			barilsGeneration(game);
			frameBeforeBaril = randomInt(15, 30);
		}
		handlePlayersPhysics(game);
		if (game.isStarted) {
			checkForBarilCollisions(game);
			checkForWin(game);
		}
		sendGameState(game);
	}
}

function isCollidingWithBaril(player: PlayerDatas, baril: { x: number, y: number }): boolean
{
	const collDistX = PLAYER_HALF_W + BARREL_HALF_SIZE;
	const collDistY = PLAYER_HALF_H + BARREL_HALF_SIZE;
	return Math.abs(player.x - baril.x) < collDistX
		&& Math.abs(player.y - baril.y) < collDistY;
}

function respawnPlayer(player: PlayerDatas, game: Game): void
{
	if (player.isGoingSpawn)
		return ;
	player.x = game.map!.spawnPoint.x;
	player.y = game.map!.spawnPoint.y;
	player.velocityY = 0;
	player.isOnGround = false;
	player.isGoingSpawn = true;
	setTimeout(() => {
		player.isGoingSpawn = false;
	}, IMMOBILIZED_TIME);
}

function checkPlayerCollisionsWithBarils(player: PlayerDatas, game: Game)
{
	game.barils.forEach((baril) => {
		if (isCollidingWithBaril(player, baril))
			respawnPlayer(player, game);
	});
}

function checkForBarilCollisions(game: Game)
{
	game.barils.forEach((baril) => {
		game.players.forEach((player) => {
			if (isCollidingWithBaril(player, baril))
				respawnPlayer(player, game);
		});
	});
}

function checkForWin(game: Game)
{
	game.players.forEach((player) => {
		const diffX = player.x - game.map!.goalPoint.x;
		const diffY = player.y - game.map!.goalPoint.y;

		if (diffX < DIST_FOR_WIN && diffX > -DIST_FOR_WIN && diffY < 0 && diffY > -DIST_FOR_WIN)
		{
			game.isFinish = true;
			sendGameState(game);
		}
	});

	if (game.isFinish) {
		const playerIds = Array.from(game.players.keys());
		playerIds.forEach(id => game.players.delete(id));
		games.delete(game.id.toString());
	}
}

function barilsGeneration(game: Game)
{
	if (!game.map)
		return;
	
	if (game.barils.size >= 28)
		return;
	game.barils.set(`baril_${Date.now()}`, {
		x: game.map.spawnPoint.x -500,
		y: 0,
		id: `baril_${Date.now()}`
	});
}

export function sendGameState(game: Game, includeMap: boolean = false)
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
		})) as PlayerDatas[];
		
		const message: KongGameState = {
			type: 'gameState',
			players: playersData,
			barils: Object.fromEntries(game.barils),
		};
		
		
		if (mapData) {
			message.map = mapData;
		}
		
		player.socket.send(JSON.stringify(message));
	});
}

function handleBarilsPhysics(game: Game)
{
	const toDelete: string[] = [];
	game.barils.forEach((baril) => {
		if (baril.y > kongMaxHeight + 50)
		{
			toDelete.push(baril.id);
			return ;	
		}
		let targetPlatformY = Infinity;
		let platformUnderBaril = game.map!.platforms[0]!;

		for (const platform of game.map!.platforms)
		{
			if (baril.x < platform.startX || baril.x > platform.endX)
				continue;
			
			const platformY = getPlatformYAtX(platform, baril.x);
			if (platformY >= baril.y && platformY < targetPlatformY)
			{
				platformUnderBaril = platform;
				targetPlatformY = platformY;
			}
		}
		if (targetPlatformY < Infinity)
		{
			if (targetPlatformY - baril.y <= BARREL_FALL_SPEED)
				baril.y = targetPlatformY;
			else
				baril.y += BARREL_FALL_SPEED;
		}
		else
			baril.y += BARREL_FALL_SPEED;

		if (baril.y == targetPlatformY)
		{
			baril.x += platformUnderBaril.fallOnRight ? BARREL_FALL_SPEED : -BARREL_FALL_SPEED;
			baril.y = getPlatformYAtX(platformUnderBaril, baril.x);
		}

		if ((baril.x > platformUnderBaril.endX - 50) || (baril.x < platformUnderBaril.startX + 50))
			baril.y += 10;
	});
}

function handlePlayersPhysics(game: Game)
{
	if (!game.map)
		return;

	handleBarilsPhysics(game);

	game.players.forEach((player) => {
		if (player.isOnGround) {
			let stayOnPlatform = false;
			for (const platform of game.map!.platforms) {
				if (player.x < platform.startX || player.x > platform.endX)
					continue;
				const platformY = getPlatformYAtX(platform, player.x);
				const feetY = player.y + persoKongHeight / 2;
				if (Math.abs(feetY - platformY) <= 20) {
					player.y = platformY - persoKongHeight / 2;
					stayOnPlatform = true;
					break;
				}
			}
			if (!stayOnPlatform)
				player.isOnGround = false;
		}

		if (player.isGoingDown)
		{
			player.y += 10;
			player.isGoingDown = false;
			player.isOnGround = false;
		}

		if (!player.isOnGround) {
			player.velocityY += GRAVITY;
			const previousY = player.y;
			player.y += player.velocityY;

			// Head collision (block player from passing through platform from below)
			if (player.velocityY < 0 && (player.x > 150 && player.x < game.map!.platforms[0]!.endX - 150)) {
				let bestPlatformY = -1;
				// let actualPlatform = game.map!.platforms[0]!;
				for (const platform of game.map!.platforms) {
					if (player.x < platform.startX - 50 || player.x > platform.endX)
						continue;
					const platformY = getPlatformYAtX(platform, player.x);
					const prevHeadY = previousY - persoKongHeight / 2;
					const currHeadY = player.y - persoKongHeight / 2;

					if (prevHeadY >= platformY && currHeadY <= platformY) {
						if (platformY > bestPlatformY)
						{
							bestPlatformY = platformY;
							// actualPlatform = platform;
						}
					}
				}

				if (bestPlatformY > -1) {
					player.y = bestPlatformY + 8 * persoKongHeight;
					player.velocityY = 0;
				}
			}

			// Feet collision (land on platform from above)
			let bestPlatformY = Infinity;
			for (const platform of game.map!.platforms) {
				if (player.x < platform.startX || player.x > platform.endX)
				{
					player.isOnGround = false;					
					continue;
				}
				const platformY = getPlatformYAtX(platform, player.x);
				const prevFeetY = previousY + persoKongHeight / 2;
				const currFeetY = player.y + persoKongHeight / 2;

				if (prevFeetY <= platformY && currFeetY >= platformY && player.velocityY > 0) {
					if (platformY < bestPlatformY)
						bestPlatformY = platformY;
				}
			}

			if (bestPlatformY < Infinity) {
				player.y = bestPlatformY - persoKongHeight / 2;
				player.velocityY = 0;
				player.isOnGround = true;
				player.isJumping = false;
			}
		}

		

		if (player.y > kongMaxHeight + 50) {
			player.x = game.map!.spawnPoint.x;
			player.y = game.map!.spawnPoint.y;
			player.velocityY = 0;
			player.isOnGround = false;
		}
	});
}

