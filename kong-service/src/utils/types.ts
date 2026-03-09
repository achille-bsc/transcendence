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
  id:        number,
  startX:    number,
  endX:      number,
  startY:    number,
  endY:      number,
  hasLadder: boolean,
  ladderX:   number,
  fallOnRight: boolean,
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

export type KongGameState = {
  type: 'gameState',
  players: PlayerDatas[],
  map?: {
    platforms: Platform[],
    spawnPoint: { x: number, y: number },
    goalPoint: { x: number, y: number },
  }
  barils: Record<string, Baril>
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
            | 'startGame'
          ),
          string,
          Difficults,
          "local" | "online"
        ],
        Localuser: {
          id: string,
        }
      }
    }
  | {
      type:         'auth',
      userID:       string
      payload:      { token: string }
    }
;
export type ClientState = {
  id?:				      string,
  isAuthenticated:	boolean,
  lastPingAt:		    number,
  gameId:			      string | null,
  localPlayerId?:   string,
}

export type PlayerDatas = {
  id:				        string,
  x:				        number,
  y:				        number,
  velocityY:		    number,
  isGoingLeft?:		  boolean,
  isGoingRight?:	  boolean,
  isJumping?:		    boolean,
  isOnGround?:		  boolean,
  isGoingDown?:	    boolean,
  isGoingSpawn?:	    boolean,
  socket:			      WebSocket,
}

export type Baril = {
    x: number,
    y: number,
    id: string,
}

export type Game = {
  host:			    	  string,
  id:               number,
  difficulty:	  	  Difficults,
  players_count:	  number,
  players:			    Map<string, PlayerDatas>,
  barils:			      Map<string, Baril>
  map?:		    		  KongMap,
  isFinish:		  	  boolean,
  isStarted:	  	  boolean,
  isLocal:		  	  boolean,
}