/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/22 15:01:25 by abosc             #+#    #+#             */
/*   Updated: 2026/03/12 12:14:19 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Fastify from 'fastify';
import WebSocket from '@fastify/websocket';

import { PORT, HANDLERS, clients } from './utils/const';
import { ClientState, WSMessage } from './utils/types';
import { parseMessage } from './utils/utils';
import fs from 'fs';

const fastify = Fastify({
  logger: false,
  https: {
    key: fs.readFileSync('/app/certs/private/kong-service.key'),
    cert: fs.readFileSync('/app/certs/public/kong-service.crt'),
  }
});

fastify.register(WebSocket);

fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (socket, _req) => {
    const state: ClientState = {
      isAuthenticated: false,
      lastPingAt: Date.now(),
      gameId: null
    };

    clients.set(socket, state);

    socket.on('message', (raw: string | Buffer)  => {
      const msg: WSMessage | null = parseMessage(raw);
      console.log("msg?.userID: ", msg?.userID);
      console.log("state.isAuth: ", state.isAuthenticated);
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
      
      // TODO: solve the only 1 game BUG
      HANDLERS[msg.type]?.(socket, msg, state, clients);
    });

    socket.on('close', () => {
      clients.delete(socket);
    });
    socket.on('error', () => {
      clients.delete(socket);
    });
  });
});

fastify.listen({ port: PORT as number, host: '0.0.0.0' }, (err) => {
  if (err) throw err;
  console.log(`Server listening at port ${PORT}`);
});


