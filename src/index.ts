/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/22 15:01:25 by abosc             #+#    #+#             */
/*   Updated: 2026/01/16 14:55:19 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Fastify from 'fastify';
import WebSocket from '@fastify/websocket';

import { PORT, HANDLERS, clients } from './utils/const';
import { ClientState, WSMessage } from './utils/types';
import { parseMessage } from './utils/utils';

const fastify = Fastify({
  logger: false,
});
fastify.register(WebSocket);

fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (socket, _req) => {
    const state: ClientState = {
      isAuthenticated: false,
      lastPingAt: Date.now(),
      gameId: null
    };
    console.log('New client connected')

    clients.set(socket, state);

    socket.on('message', (raw: string | Buffer)  => {
      console.log(`Received message: ${raw}`);
      const msg: WSMessage | null = parseMessage(raw);
      if (!msg) {
        socket.send(JSON.stringify({ type: 'error', error: 'Invalid message format' }));
        return;
      }
      
      if (!state.isAuthenticated && msg.type !== 'auth') {
        socket.send(JSON.stringify({ type: 'error', error: 'Unauthorized' }));
        socket.close(1008, 'Unauthorized');
        return;
      }
      
      // Send acknowledgement back to client
      // socket.send(JSON.stringify({ type: 'ack', receivedType: msg.type }));
      
      HANDLERS[msg.type]?.(socket, msg, state, clients);
    });

    socket.on('close', () => {});
    socket.on('error', (err: Error) => {
      console.log(`Error: ${err}`)
    });
  });
});

fastify.listen({ port: PORT as number }, (err) => {
  if (err) throw err;
  console.log(`Server listening at port ${PORT}`);
});
















