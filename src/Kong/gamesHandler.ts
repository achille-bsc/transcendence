/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gamesHandler.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marvin <marvin@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/29 16:27:36 by marvin            #+#    #+#             */
/*   Updated: 2025/12/29 16:27:36 by marvin           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { ClientState, Game, Difficults } from "../utils/types";
import { games, kongMaxHeight, kongMaxLength, kongPlayerMaxSpeed, persoKongHeight, persoKongWidth } from "../utils/const";


export function handleGame(state: ClientState, datas:
	[
		"createGame"
			| "joinGame"
			| "jump"
			| "goLeft"
			| "goRight",
		Difficults
	]
): void
{
	if (!state.gameId)
		return ;
	const game: Game | undefined = games.get(state.gameId);
	if (!game)
		return ;

	switch (datas[0]) {
		case 'jump':
			
			break;
	
		case 'goLeft':

			break;
		
		case 'goRight':

			break;
		default:
			break;
	}
}

export function startGame(game: Game)
{
	// initiate the players values when they are added to the game
	// but it stay here for now
	game.players.forEach((player) => {
		player.x = persoKongWidth	/ 2;
		player.y = persoKongHeight	/ 2;
		player.vSpeed = 0.0;
		player.hSpeed = 0.0;
		player.maxSpeed = kongPlayerMaxSpeed;
	});

	while (!game.isFinish && game.isStarted) {
		// Players Movements => on verifie seulement que le perso sort pas de l'ecran
		// On rajoutera les collisions une fois le concept de map etablis
		game.players.forEach((player) => {
			if (player.vSpeed != 0)
			{
				if (player.y + player.vSpeed > (kongMaxHeight - (persoKongHeight / 2)))
					player.y = (kongMaxHeight - (kongMaxHeight / 2));
				else
					player.y += player.vSpeed;
			}
			if (player.hSpeed != 0)
			{
				if (player.x + player.hSpeed > (kongMaxLength - (persoKongWidth / 2)))
					player.x = (kongMaxLength - (kongMaxLength / 2));
				else
					player.x += player.hSpeed;
			}
		})
	}

}