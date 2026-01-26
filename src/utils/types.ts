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

export enum Difficults 
{
  easy        = 'easy',
  normal      = 'normal',
  difficulty  = 'difficult',
  impossible  = 'impossible'
}

export type WSMessage = 
  | {
      type: 'kong',
      userID: string
      payload:
      {
        type:
          | 'gameAction'
          | 'globalAction',
        datas: [
          (
            | 'createGame'
            | 'joinGame'
            | 'jump'
            | 'goLeft'
            | 'goRight'
          ),
          Difficults,
          string,
        ]
      }
    }
  | {
      type: 'aow',
      userID: string
      payload:
      {
        type:
          | 'gameAction'
          | 'globalAction',
        datas: [
          ('createGame' | 'joinGame'),
          Difficults
        ]
      }
    }
  | {
      type: 'auth',
      userID: string
      payload: { token: string }
    }
;
export type ClientState = {
  id?: string,
  isAuthenticated: boolean,
  lastPingAt: number,
  gameId: string | null
}

export type PlayerDatas = {
  id: string,
  x: number,
  y: number,
  vSpeed: number,
  hSpeed: number,
  maxSpeed: number,
  socket: WebSocket,
  isJumping?: boolean
}

export type Game = {
  host: string,
  difficulty: Difficults,
  players_count: number,
  players: Map<string, PlayerDatas>,
  isFinish: boolean
  isStarted: boolean
}