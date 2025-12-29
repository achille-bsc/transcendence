/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/17 20:07:52 by abosc             #+#    #+#             */
/*   Updated: 2025/12/17 20:11:51 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { ClientState, Game, WSMessage, PlayerDatas }					from "../utils/types";
import { WebSocket }													from "@fastify/websocket";
import { error }														from "../utils/utils";
import { games, kongPlayerMaxSpeed, persoKongHeight, persoKongWidth }	from "../utils/const";
import { handleGame }													from "./gamesHandler";

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
			createGame(clients, webSocket, msg);
		// if (msg.payload.datas[0] === 'joinGame')
		// 	joinGame(values); // I will le faire plus tard because I have la flemme

	}
	else if (msg.payload.type === 'gameAction')
	{
		handleGame(state, msg.payload.datas)
	}
}

function createGame(
	clients: Map<WebSocket, ClientState>,
	webSocket: WebSocket,
	msg: WSMessage
) {
	if (msg.type !== 'kong') return ;
	if (games.get(msg.userID) !== null)
		return (error('UserAllreadyHostGame'))
	const game: Game = {
		host: msg.userID,
		difficulty: msg.payload.datas[1],
		players_count: 1,
		players: new Map<string, PlayerDatas>(),
		isFinish: false,
		isStarted: false
	}
	const owner: PlayerDatas = {
		is: msg.userID,
		x: persoKongWidth	/ 2,
		y: persoKongHeight	/ 2,
		vSpeed: 0.0,
		hSpeed: 0.0,
		maxSpeed: kongPlayerMaxSpeed
	}
	game.players.set(owner.is, owner);
}