/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   kongHandler.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/17 20:07:52 by abosc             #+#    #+#             */
/*   Updated: 2026/01/26 12:55:18 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { ClientState, Game, WSMessage, PlayerDatas }					from "../utils/types";
import { WebSocket }													from "@fastify/websocket";
import { error }														from "../utils/utils";
import { games, kongPlayerSpeed, persoKongHeight, persoKongWidth }	from "../utils/const";
import { handleGame, startGame }													from "./gamesHandler";

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
	if (msg.type === 'kong' && msg.payload.datas[1] != undefined)
	{
		const player: PlayerDatas = {
			id: msg.userID,
			x: persoKongWidth	/ 2,
			y: persoKongHeight	/ 2,
			vSpeed: 0.0,
			hSpeed: 0.0,
			maxSpeed: kongPlayerSpeed,
			socket: webSocket
		}
		const game = games.get(msg.payload.datas[1]);
		if (!game)
		{
			webSocket.send(JSON.stringify({ type: 'gameNotJoined', gameId: msg.payload.datas[1] }));
			return ;	
		}
		game.players.set(player.id, player);
		state.gameId = game.host;
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
		difficulty: msg.payload.datas[1],
		players_count: 1,
		players: new Map<string, PlayerDatas>(),
		isFinish: false,
		isStarted: false
	}
	const owner: PlayerDatas = {
		id: msg.userID,
		x: persoKongWidth	/ 2,
		y: persoKongHeight	/ 2,
		vSpeed: 0.0,
		hSpeed: 0.0,
		maxSpeed: kongPlayerSpeed,
		socket: webSocket
	}
	game.players.set(owner.id, owner);
	state.gameId = msg.userID;
	webSocket.send(JSON.stringify({ type: 'gameCreated', gameId: msg.userID }));
	games.set(msg.userID, game);
	startGame(game);
}