/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   const.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/22 14:46:01 by abosc             #+#    #+#             */
/*   Updated: 2026/03/11 22:35:13 by abosc            ###   ########.fr       */
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
export const persoKongHeight	= 5;
export const persoKongWidth		= 5;
export const kongPlayerSpeed	= 25;
export const kongMaxHeight		= 650;
export const kongMaxLength		= 1600;
export const GRAVITY			= 25;
export const JUMP_FORCE			= -80;
export const MOVE_SPEED			= 3;
export const BARREL_FALL_SPEED  = 15;
export const IMMOBILIZED_TIME   = 1000;
export const PLAYER_HALF_W		= 4;
export const PLAYER_HALF_H		= 4;
export const BARREL_HALF_SIZE	= 3;
export const DIST_FOR_WIN       = 30;
export const SECONDS_BEFORE_START   = 8;

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