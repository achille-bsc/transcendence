/* ************************************************************************** */
/*                                                                            */
/*   types.ts                                           :+:      :+:    :+: */
/*                                                    +:+ +:+         +:+     */
/*   Types et interfaces pour les websockets et jeux                       */
/*                                                +#+#+#+#+#+   +#+           */
/*                                                                            */
/* ************************************************************************** */

export type GameType = 'kong' | 'aow'; // aow = Age Of War

export type Platform = {
  id:        number,    // Numéro de l'étage (0 = bas)
  startX:    number,    // X gauche
  endX:      number,    // X droite  
  startY:    number,    // Y à gauche
  endY:      number,    // Y à droite (différent = diagonale)
  hasLadder: boolean,   // Échelle vers l'étage suivant
  ladderX:   number,    // Position X de l'échelle
}

export type KongMap = {
  platforms:  Platform[],
  spawnPoint: { x: number, y: number },
  goalPoint:  { x: number, y: number },
}

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
          string,
          Difficults,
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
  id?:				string,
  isAuthenticated:	boolean,
  lastPingAt:		number,
  gameId:			string | null
}

export type PlayerDatas = {
  id:				string,
  x:				number,
  y:				number,
  velocityY:		number,			// Vitesse verticale (gravité)
  isGoingLeft?:		boolean,
  isGoingRight?:	boolean,
  isJumping?:		boolean,
  isOnGround?:		boolean,		// Est sur une plateforme
  socket:			WebSocket,
}

export type Game = {
  host:				string,
  id:         number,
  difficulty:		Difficults,
  players_count:	number,
  players:			Map<string, PlayerDatas>,
  map?:				KongMap,		// Map du niveau
  isFinish:			boolean
  isStarted:		boolean
  barils:			{ x: number, y: number }[]
}