/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/22 15:01:25 by abosc             #+#    #+#             */
/*   Updated: 2025/12/22 15:01:25 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Fastify from 'fastify';

import { PORT, HANDLERS } from './utils/const';
import { ClientState, WSMessage } from './utils/types';

const fastify = Fastify({
  logger: true,
});


function parseMessage(raw: string | Buffer): WSMessage | null {
  try {
    if (typeof raw !== 'string')
      return JSON.parse(raw.toString());
    return (null);
  } catch {
    return null;
  }
};

// Charge le plugin WebSocket
fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (socket, _req) => {
    const state: ClientState = {
      isAuthenticated: false,
      lastPingAt: Date.now()
    };

    // For each Package
    socket.on('message', (raw: string| Buffer)  => {
      const msg: WSMessage | null = parseMessage(raw);
      if (!msg) return;
      
      if (!state.isAuthenticated && msg.type !== 'auth')
        socket.close(1008, 'Unauthorized');
      
      HANDLERS[msg.type]?.(socket, msg, state);
    });

    socket.on('close', () => {});
    socket.on('error', () => {});
  });
});

fastify.listen({ port: PORT as number, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err;
  console.log(`Server listening at ${address}`);
});
















