/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/22 15:01:25 by abosc             #+#    #+#             */
/*   Updated: 2026/02/26 23:22:00 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Fastify from 'fastify';
import WebSocket from '@fastify/websocket';

import { PORT, HANDLERS, clients, games } from './utils/const';
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

    socket.on('close', () => {
      games.forEach((game) => {
        if (game.players.has(state.id!)) {
          game.players.delete(state.id!);
        }
        if (game.host === state.id) {
          game.isFinish = true;
          games.delete(game.id.toString());
        }
      });
      clients.delete(socket);
    });
    socket.on('error', (err: Error) => {
      console.log(`Error: ${err}`)
    });
  });
});

fastify.listen({ port: PORT as number }, (err) => {
  if (err) throw err;
  console.log(`Server listening at port ${PORT}`);
});


