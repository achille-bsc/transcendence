/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/17 20:07:48 by abosc             #+#    #+#             */
/*   Updated: 2025/12/17 20:07:49 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { ClientState, WSMessage } from "../utils/types";
import { WebSocket } from "@fastify/websocket";

export function aowHandler(webSocket: WebSocket, msg: WSMessage, state: ClientState)
{

}