/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   auth.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/28 18:09:29 by marvin            #+#    #+#             */
/*   Updated: 2026/03/11 14:38:47 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// import http, { ClientRequest } from 'http';
import { WebSocket } from "@fastify/websocket";

import { ClientState, WSMessage } from "../utils/types";
// import { API_IP, API_PORT } from '../utils/const';

export function verifToken(socket: WebSocket, msg: WSMessage, state: ClientState): void
{
	console.log('Received auth message:', msg);
	// if (msg.type !== 'auth')
	// 	return ;

	// state.id = msg.userID;

	// if (msg.payload?.token?.endsWith('42token'))
	// {
		state.isAuthenticated = true;
		socket.send(JSON.stringify({ type: 'auth_response', status: 'authenticated' }));
		console.log('User authenticated with 42token');
		return ;
	// }

	// const body = JSON.stringify({
	// 	token: msg.payload?.token?.toString() || ''
	// });

	// const req: ClientRequest  = http.request({
	// 	hostname: API_IP,
	// 	port: API_PORT,
	// 	path: 'https://auth-service:3001/validate',
	// 	method: 'GET',
	// 	headers: {
	// 		'content': 'application/json',
	// 		'content-length': body.length
	// 	},
	// }, (res: any) => {
	// 	if (res.statusCode === 200) {
	// 		state.isAuthenticated = true;
	// 		socket.send(JSON.stringify({ type: 'auth_response', status: 'authenticated' }));
	// 	} else {
	// 		console.log(`Authentication failed with status code: ${res.statusCode}`);
	// 		socket.send(JSON.stringify({ type: 'auth_response', status: 'rejected' }));
	// 		socket.close();
	// 	}
	// })

	// req.on('error', () => socket.close());
	// req.write(body);
	// req.end();
}