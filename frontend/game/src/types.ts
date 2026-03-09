/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   types.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/12 14:33:57 by abosc             #+#    #+#             */
/*   Updated: 2026/03/08 14:04:02 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export interface PlayerState {
	id: string;
	x: number;
	y: number;
	isOnGround: boolean;
	isJumping: boolean;
}

export type Platform = {
  id:        number,    // Numéro de l'étage (0 = bas)
  startX:    number,    // X gauche
  endX:      number,    // X droite  
  startY:    number,    // Y à gauche
  endY:      number,    // Y à droite (différent = diagonale)
  hasLadder: boolean,   // Échelle vers l'étage suivant
  ladderX:   number,    // Position X de l'échelle
}

export type Baril = {
  x: number,
  y: number,
}

export type KongGameState = {
  type: 'gameState',
  players: PlayerState[],
  barils?: Record<string, Baril>,
  map?: {
    platforms: Platform[],
    spawnPoint: { x: number, y: number },
    goalPoint: { x: number, y: number },
  }
}

export type mapPlatform = {
	id:        number,
	startX:    number,
	endX:      number,
	startY:    number,
	endY:      number,
	hasLadder: boolean,
	ladderX:   number,
}

export interface AuthResponseMessage {
	type: "auth_response";
	success: boolean;
	message?: string;
}

export interface GameCreatedMessage {
	type: "gameCreated";
	gameId: string;
}

export interface GameJoinedMessage {
	type: "gameJoined";
	gameId: string;
}

export interface ErrorMessage {
	type: "error";
	message: string;
}

export type ServerMessage =
	| KongGameState
	| AuthResponseMessage
	| GameCreatedMessage
	| GameJoinedMessage
	| ErrorMessage;

export type Difficulty = "easy" | "medium" | "hard";

export type KongAction =
	| "createGame"
	| "joinGame"
	| "jump"
	| "goLeft"
	| "goRight"
	| "goDown";

export interface KongGameActionMessage {
	type: "kong";
	userID: string;
	payload: {
		type: "gameAction" | "globalAction";
		datas: [KongAction, string?, Difficulty?, ("local" | "online")?];
		Localuser: {id: string};
	};
}

export interface AuthMessage {
	type: "auth";
	userID: string;
	payload: {
		token: string;
	};
}

export type ClientMessage = KongGameActionMessage | AuthMessage;

export interface KongGameConfig {
	wsUrl: string;
	userToken: string;
	userId: string;
	canvasWidth?: number;
	canvasHeight?: number;
	maxReconnectAttempts?: number;
	reconnectDelay?: number;
	/**
	 * Vitesse d'interpolation (0 à 1). Contrôle la fluidité des déplacements.
	 * - 0.15 = très doux / lent
	 * - 0.25 = bon équilibre (défaut)
	 * - 0.5  = réactif
	 * - 1.0  = pas de lissage (positions brutes du serveur)
	 */
	interpolationDelay?: number;
	gameMode?: "local" | "online";
	localPlayer2Id?: string;
}

export type KongGameEventMap = {
	connected: void;
	disconnected: { code: number; reason: string };
	reconnecting: { attempt: number; maxAttempts: number };
	reconnectFailed: void;
	authenticated: AuthResponseMessage;
	gameState: KongGameState;
	gameCreated: GameCreatedMessage;
	gameJoined: GameJoinedMessage;
	error: string;
};
