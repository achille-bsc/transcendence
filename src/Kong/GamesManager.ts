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

import { ClientState, WSMessage } from "../utils/types";
import { WebSocket } from "@fastify/websocket";

export function kongHandler(webSocket: WebSocket, msg: WSMessage, state: ClientState): void
{
	
}