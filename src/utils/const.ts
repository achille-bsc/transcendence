/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   const.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/22 14:46:01 by abosc             #+#    #+#             */
/*   Updated: 2025/12/22 14:46:01 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { kongHandler }	from "../Kong/GamesManager";
import { aowHandler }	from "../AgeOfWar/GamesManager";

export const playerConnections: Map<string, any>	= new Map();
export const PORT: number							= process.env['PORT'] ? parseInt(process.env['PORT']) : 3000;

export const HANDLERS = {
    kong:	kongHandler,
    aow:	aowHandler,
    auth:	auth,
};