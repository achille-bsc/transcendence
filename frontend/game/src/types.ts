/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   types.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/12 14:33:57 by abosc             #+#    #+#             */
/*   Updated: 2026/03/12 11:53:14 by abosc            ###   ########.fr       */
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
  id:        number,    // Floor number (0 = bottom)
  startX:    number,    // X left
  endX:      number,    // X right  
  startY:    number,    // Y on the left
  endY:      number,    // Y on the right (different = diagonal)
  hasLadder: boolean,   // Ladder to the next floor
  ladderX:   number,    // X position of the ladder
}

export type Baril = {
  x: number,
  y: number,
}

export type KongGameState = {
  type: 'gameState',
  players: PlayerState[],
  barils?: Record<string, Baril>,
  winner?: string,
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

export interface KongGameTranslations {
	createButton: string;
	joinButton: string;
	connecting: string;
	connectedAuthenticating: string;
	authenticated: string;
	gameCreated: string;
	gameJoined: string;
	disconnected: string;
	reconnecting: string;
	reconnectFailed: string;
	waitingPlayers: string;
	disconnectedFromServer: string;
	attemptingReconnect: string;
	victoryTitle: string;
	playerWon: string;
	playAgain: string;
}

export interface KongGameConfig {
	wsUrl: string;
	userToken: string;
	userId: string;
	canvasWidth?: number;
	canvasHeight?: number;
	maxReconnectAttempts?: number;
	reconnectDelay?: number;
	/**
	 * Interpolation speed (0 to 1). Controls movement smoothness.
	 * - 0.15 = very smooth / slow
	 * - 0.25 = good balance (default)
	 * - 0.5  = responsive
	 * - 1.0  = no smoothing (raw server positions)
	 */
	interpolationDelay?: number;
	gameMode?: "local" | "online";
	localPlayer2Id?: string;
	translations?: Partial<KongGameTranslations>;
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
