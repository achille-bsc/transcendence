/* ************************************************************************** */
/*                                                                            */
/*   index.ts - Library entry point (public exports)                          */
/*                                                                            */
/*   This is the file React will import:                                      */
/*     import { KongGame } from 'ft_transcendence_front';                     */
/*                                                                            */
/* ************************************************************************** */

export { KongGame } from "./game/KongGame";
export { GameNetworkLayer } from "./network/GameNetworkLayer";
export { WebSocketClient } from "./network/WebSocketClient";

export type {
	KongGameConfig,
	KongGameEventMap,
	KongGameTranslations,
	PlayerState,
	Difficulty,
	KongAction,
	KongGameState,
	AuthResponseMessage,
	ServerMessage,
	ClientMessage,
} from "./types";
