/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/12/28 22:20:21 by marvin            #+#    #+#             */
/*   Updated: 2026/01/23 12:07:18 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { WSMessage } from "./types";

export function parseMessage(raw: string | Buffer): WSMessage | null {
  try {
	const jsonString = typeof raw === 'string' ? raw : raw.toString();
	return JSON.parse(jsonString);
  } catch {
	return null;
  }
};

export function error(
	err?: 
		| 'unauth'
		| 'wrongType'
		| 'UserAllreadyHostGame'
		| undefined,
	message?: string
) {
	switch (err) {
		case 'unauth':
			console.log(`Error: The user is not Authentified`)
			break;
	
		case 'UserAllreadyHostGame':
				console.log(`Error: The user Already Host a Game. Please close the actually hosted game to create a new one`)
				break;

		case 'wrongType':
			console.log(`Error: The provided type is not valid. Please provide a valide type`);
			break;

		default:
			console.log(`Error: An unrecognized error append\n${message}`);
			break;
	}
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}