/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/28 18:09:29 by marvin            #+#    #+#             */
/*   Updated: 2026/03/12 12:31:44 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { WebSocket } from "@fastify/websocket";

import { ClientState, WSMessage } from "../utils/types";
import { games } from "../utils/const";
import { sendGameState } from "../Kong/gamesHandler";;

export function verifToken(socket: WebSocket, msg: WSMessage, state: ClientState): void
{
	console.log('Received auth message:', msg);


	state.id = msg.userID;

		state.isAuthenticated = true;
		socket.send(JSON.stringify({ type: 'auth_response', status: 'authenticated' }));
		console.log('User authenticated with 42token');

		// Reconnect to existing game if the user was in one
		for (const [gameId, game] of games) {
			const existingPlayer = game.players.get(msg.userID);
			if (existingPlayer && !game.isFinish) {
				existingPlayer.socket = socket;
				state.gameId = gameId;
				socket.send(JSON.stringify({ type: 'gameReconnected', gameId }));
				sendGameState(game, true);
				console.log(`User ${msg.userID} reconnected to game ${gameId}`);
				return ;
			}
		}

		return ;
}