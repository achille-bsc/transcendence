/* ************************************************************************** */
/*                                                                            */
/*   types.ts                                           :+:      :+:    :+: */
/*                                                    +:+ +:+         +:+     */
/*   Types et interfaces pour les websockets et jeux                       */
/*                                                +#+#+#+#+#+   +#+           */
/*                                                                            */
/* ************************************************************************** */

export type GameType = 'kong' | 'aow'; // aow = Age Of War

/**
 * ============================================================================
 * MESSAGE TYPES - Communication Front <-> Back via WebSocket
 * ============================================================================
 */

export type WSMessage = 
  | { type: 'kong', payload: { type: 'gameAction' | 'globalAction', datas: string } }
  | { type: 'aow',  payload: { type: 'gameAction' | 'globalAction', datas: string } }
  | { type: 'auth',  payload: { datas: string } }

export type ClientState = {
  isAuthenticated: boolean,
  lastPingAt: number,
}