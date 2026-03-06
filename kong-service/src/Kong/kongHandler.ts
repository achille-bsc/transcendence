/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   kongHandler.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/17 20:07:52 by abosc             #+#    #+#             */
/*   Updated: 2026/02/27 19:16:05 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { ClientState, Game, WSMessage, PlayerDatas }	from "../utils/types";
import { WebSocket }									from "@fastify/websocket";
import { error }										from "../utils/utils";
import { games, persoKongHeight, persoKongWidth }		from "../utils/const";
import { handleGame, startGame }						from "./gamesHandler";

export function kongHandler(
	webSocket: WebSocket,
	msg: WSMessage,
	state: ClientState,
	clients: Map<WebSocket, ClientState>
): void
{
	console.log(msg);
	if (!state.isAuthenticated)
		return (error('unauth'));

	if (msg.type != 'kong')
		return (error('wrongType'));

	if (msg.payload.type === 'globalAction')
	{
		if (msg.payload.datas[0] === 'createGame')
			createGame(clients, webSocket, msg, state);
		if (msg.payload.datas[0] === 'joinGame')
			joinGame(msg, webSocket, state);

	}
	else if (msg.payload.type === 'gameAction')
	{
		handleGame(state, msg.payload.datas)
	}
}

function joinGame(msg: WSMessage, webSocket: WebSocket, state: ClientState): void
{
	console.log("try connecting to game");
	if (msg.type === 'kong' && msg.payload.datas[1] != undefined)
	{
		console.log("try connecting to game with id : " + msg.payload.datas[1]);
		console.log("games ids: " + Array.from(games.keys()).join(', '));
		const game = games.get(msg.payload.datas[1]);
		if (!game)
		{
			console.log("game not found");
			webSocket.send(JSON.stringify({ type: 'gameNotJoined', gameId: msg.payload.datas[1] }));
			return ;	
		}
		const player: PlayerDatas = {
			id: msg.userID,
			x: game.map!.spawnPoint.x,
			y: game.map!.spawnPoint.y,
			velocityY: 0,
			isOnGround: false,
			socket: webSocket
		}
		game.players.set(player.id, player);
		state.gameId = game.id.toString();
		console.log(`Player ${player.id} joined game ${game.host}`);
		webSocket.send(JSON.stringify({ type: 'gameJoined', gameId: game.host }))
	}
}

function createGame(
	_clients: Map<WebSocket, ClientState>,
	webSocket: WebSocket,
	msg: WSMessage,
	state: ClientState
) {
	if (msg.type !== 'kong') return ;
	// A REACTIVER QUAND LES TESTS DE GAME SERONT FINIS
	// if (games.get(msg.userID) !== undefined)
	// {
	// 	webSocket.send(JSON.stringify({ type: 'gameNotCreated', gameId: msg.userID }));
	// 	return (error('UserAllreadyHostGame'))
	// }
	const game: Game = {
		host: msg.userID,
		id: games.size + 1,
		barils: [],
		difficulty: msg.payload.datas[2],
		players_count: 1,
		players: new Map<string, PlayerDatas>(),
		isFinish: false,
		isStarted: false
	}
	const owner: PlayerDatas = {
		id: msg.userID,
		x: persoKongWidth	/ 2,
		y: persoKongHeight	/ 2,
		velocityY: 0,
		isGoingLeft: false,
		isGoingRight: false,
		isOnGround: false,
		socket: webSocket
	}
	game.players.set(owner.id, owner);
	state.gameId = game.id.toString();
	webSocket.send(JSON.stringify({ type: 'gameCreated', gameId: game.id }));
	games.set(game.id.toString(), game);
	startGame(game);
}