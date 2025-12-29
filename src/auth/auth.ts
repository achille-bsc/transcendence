/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/28 18:09:29 by marvin            #+#    #+#             */
/*   Updated: 2025/12/28 18:09:29 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import http, { ClientRequest } from 'http';
import { ClientState, WSMessage } from "../utils/types";
import { WebSocket } from "@fastify/websocket";
import { API_IP, API_PORT } from '../utils/const';

export function verifToken(socket: WebSocket, msg: WSMessage, state: ClientState): void
{
	if (msg.type !== 'auth')
		return ;

	const body = JSON.stringify({
		token: msg.payload.token
	});

	const req: ClientRequest  = http.request({
		hostname: API_IP,
		port: API_PORT,
		path: '/intra/checkToken',
		method: 'POST',
		headers: {
			'content': 'application/json',
			'content-length': msg.payload.token.length
		},
	}, (res) => {
		if (res.statusCode === 200)
			state.isAuthenticated = true
		else
			socket.close();
	})

	req.on('error', () => socket.close());
	req.write(body);
	req.end();
}