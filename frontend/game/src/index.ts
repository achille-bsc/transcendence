/* ************************************************************************** */
/*                                                                            */
/*   index.ts - Point d'entrée de la librairie (export public)                */
/*                                                                            */
/*   C'est ce fichier que React importera :                                   */
/*     import { KongGame } from 'ft_transcendence_front';                     */
/*                                                                            */
/* ************************************************************************** */

export { KongGame } from "./game/KongGame";
export { GameNetworkLayer } from "./network/GameNetworkLayer";
export { WebSocketClient } from "./network/WebSocketClient";

export type {
	KongGameConfig,
	KongGameEventMap,
	PlayerState,
	Difficulty,
	KongAction,
	KongGameState,
	AuthResponseMessage,
	ServerMessage,
	ClientMessage,
} from "./types";
