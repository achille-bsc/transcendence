/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   kongHandler.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/17 20:07:52 by abosc             #+#    #+#             */
/*   Updated: 2026/03/12 12:32:09 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { ClientState, Game, WSMessage, PlayerDatas, Baril }	from "../utils/types";
import { WebSocket }										from "@fastify/websocket";
import { error }											from "../utils/utils";
import { games, persoKongHeight, persoKongWidth }			from "../utils/const";
import { handleGame, sendGameState, startGame }				from "./gamesHandler";

export function kongHandler(
	webSocket: WebSocket,
	msg: WSMessage,
	state: ClientState,
	clients: Map<WebSocket, ClientState>
): void
{
	if (!state.isAuthenticated)
		return (error('unauth'));

	if (msg.type != 'kong')
		return (error('wrongType'));

	console.log("msg:", msg);
	if (msg.payload.type === 'globalAction')
	{
		if (msg.payload.datas[0] === 'createGame')
			createGame(clients, webSocket, msg, state);
		if (msg.payload.datas[0] === 'joinGame')
			joinGame(msg, webSocket, state);
		if (msg.payload.datas[0] === 'leaveGame')
			leaveGame(webSocket, state);
		if (msg.payload.datas[0] === 'startGame')
		{
			const game = games.get(state.gameId!);
			if (!game)
				return (error('gameNotFound'));
			if (game.host !== state.id)
				return (error('notHost'));
			startGame(game);
		}

	}
	else if (msg.payload.type === 'gameAction')
		handleGame(state, msg.payload.datas, msg.payload.Localuser, msg)
}


function leaveGame(webSocket: WebSocket, state: ClientState): void
{
	if (!state.id) return;

	games.forEach((game, gameId) => {
		if (!game.players.has(state.id!)) return;
		game.players.delete(state.id!);

		if (game.host === state.id) {
			game.isFinish = true;
			game.players.forEach((player) => {
				try { player.socket.send(JSON.stringify({ type: 'gameEnded', reason: 'Host disconnected' })); } catch (_) {}
			});
			games.delete(gameId);
		} else {
			game.players.forEach((player) => {
				try { player.socket.send(JSON.stringify({ type: 'playerLeft', playerId: state.id })); } catch (_) {}
			});
		}
	});

	state.gameId = null;
	webSocket.send(JSON.stringify({ type: 'gameLeft' }));
}

function joinGame(msg: WSMessage, webSocket: WebSocket, state: ClientState): void
{
	console.log("try joining a game...");
	let exit = 0;
	games.forEach((game) => {
		game.players.forEach((player) => {
			if (player.id == msg.userID)
				exit = 1;
		});	
	})
	if (exit == 1) return ;
	console.log("try joining a game...");
	if (msg.type === 'kong' && msg.payload.datas[1] != undefined)
	{
		let gamePlayer;
		for (const game of games) {
			if (game[1].players_count < 4 && !game[1].isFinish && !game[1].isLocal && !game[1].isStarted)
				gamePlayer = game[1];
		}

		if (!gamePlayer)
		{
			webSocket.send(JSON.stringify({ type: 'gameNotJoined', gameId: msg.payload.datas[1] }));
			return ;	
		}

		console.log("try joining the game:", gamePlayer.id);
		const player: PlayerDatas = {
			id: msg.userID,
			x: gamePlayer.map!.spawnPoint.x,
			y: gamePlayer.map!.spawnPoint.y,
			velocityY: 0,
			isOnGround: false,
			socket: webSocket
		}
		gamePlayer.players.set(player.id, player);
		state.gameId = gamePlayer.id.toString();
		webSocket.send(JSON.stringify({ type: 'gameJoined', gameId: gamePlayer.id }));
		sendGameState(gamePlayer, true);
	}
}

function createGame(
	_clients: Map<WebSocket, ClientState>,
	webSocket: WebSocket,
	msg: WSMessage,
	state: ClientState
) {
	if (msg.type !== 'kong'/*  || exit == 1 */) return ;

	const game: Game = {
		startTime: 0,
		host: msg.userID,
		id: games.size + 1,
		barils: new Map<string, Baril>(),
		difficulty: msg.payload.datas[2],
		players_count: 1,
		players: new Map<string, PlayerDatas>(),
		isFinish: false,
		isStarted: false,
		// todo: later
		isLocal: msg.payload.datas[3] === 'local' ? true : false,
	}
	const owner: PlayerDatas = {
		id:  game.isLocal ? "1" : msg.userID,
		x: persoKongWidth	/ 2,
		y: persoKongHeight	/ 2,
		velocityY: 0,
		isGoingLeft: false,
		isGoingRight: false,
		isOnGround: false,
		socket: webSocket
	}
	const localPlayer: PlayerDatas = {
		id: game.isLocal ? "2" : msg.userID,
		x: persoKongWidth	/ 2,
		y: persoKongHeight	/ 2,
		velocityY: 0,
		isGoingLeft: false,
		isGoingRight: false,
		isOnGround: false,
		socket: webSocket
	}
	game.players.set(owner.id, owner);
	if (game.isLocal)
		game.players.set(localPlayer.id, localPlayer);
	state.gameId = game.id.toString();
	webSocket.send(JSON.stringify({ type: 'gameCreated', gameId: game.id }));
	games.set(game.id.toString(), game);
	
	startGame(game);
}
