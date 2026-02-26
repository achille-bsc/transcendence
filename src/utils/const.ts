/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   const.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/22 14:46:01 by abosc             #+#    #+#             */
/*   Updated: 2026/02/26 02:24:58 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { kongHandler }	from "../Kong/kongHandler";
import { verifToken } from "../auth/auth";
import { ClientState, Game } from "./types";

import { WebSocket } from "@fastify/websocket";

export const PORT: number       = process.env['PORT']       ? parseInt(process.env['PORT'])     : 3000;
export const API_PORT: number   = process.env['API_PORT']   ? parseInt(process.env['API_PORT']) : 8080;
export const API_IP: string     = process.env['API_IP'] ||  'localhost';

export const clients:           Map<WebSocket, ClientState>
                = new           Map<WebSocket, ClientState>();
export const games:             Map<string, Game>
                = new           Map<string, Game>();

//////////
// Kong //
//////////
export const persoKongHeight	= 10;
export const persoKongWidth		= 5;
export const kongPlayerSpeed	= 25;
export const kongMaxHeight		= 650;
export const kongMaxLength		= 1600;
export const GRAVITY			= 0.5;
export const JUMP_FORCE			= -12;
export const MOVE_SPEED			= 10;

//////////
// MAPS //
//////////
export const FIRST_STEP_HIGHT = 510;

//////////////
// HANDLERS //
//////////////
export const HANDLERS = {
    kong:	kongHandler,
    auth:	verifToken,
};