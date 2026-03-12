/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   protocol.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/21 14:31:49 by abosc             #+#    #+#             */
/*   Updated: 2026/03/12 11:53:14 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


import type {
	AuthMessage,
	ClientMessage,
	Difficulty,
	KongAction,
	KongGameActionMessage,
	ServerMessage,
} from "../types";

// Messages Front -> back

export function buildAuthMessage(userId: string, token: string): AuthMessage {
	return {
		type: "auth",
		userID: userId,
		payload: { token },
	};
}

export function buildKongAction(
	userId: string,
	actionType: "gameAction" | "globalAction",
	action: KongAction,
	extra?: string,
	difficulty?: Difficulty,
	mode: "local" | "online" = "online",
	localUserId?: string,
): KongGameActionMessage {
	return {
		type: "kong",
		userID: userId,
		payload: {
			type: actionType,
			datas: [action, extra, difficulty, mode],
			Localuser: {id: localUserId ?? userId}
		},
	};
}

export function buildCreateGame(
	userId: string,
	gameId: string,
	difficulty: Difficulty = "medium",
	mode: "local" | "online",
): ClientMessage {
	return buildKongAction(userId, "globalAction", "createGame", gameId, difficulty, mode);
}

export function buildJoinGame(
	userId: string,
	gameId: string,
	difficulty: Difficulty = "medium",
	mode: "local" | "online" = "online",
): ClientMessage {
	return buildKongAction(userId, "globalAction", "joinGame", gameId, difficulty, mode);
}

export function buildJump(userId: string, mode: "local" | "online" = "online", localUserId?: string): ClientMessage {
	return buildKongAction(userId, "gameAction", "jump", undefined, undefined, mode, localUserId);
}

export function buildGoLeft(userId: string, mode: "local" | "online" = "online", localUserId?: string): ClientMessage {
	return buildKongAction(userId, "gameAction", "goLeft", undefined, undefined, mode, localUserId);
}

export function buildGoRight(userId: string, mode: "local" | "online" = "online", localUserId?: string): ClientMessage {
	return buildKongAction(userId, "gameAction", "goRight", undefined, undefined, mode, localUserId);
}

export function buildGoDown(userId: string, mode: "local" | "online" = "online", localUserId?: string): ClientMessage {
	return buildKongAction(userId, "gameAction", "goDown", undefined, undefined, mode, localUserId);
}

export function buildLeaveGame(userId: string): ClientMessage {
	return buildKongAction(userId, "globalAction", "leaveGame");
}

// Parsing back -> front

export function parseServerMessage(raw: string): ServerMessage | null {
	try {
		const data = JSON.parse(raw);
		if (data && typeof data === "object" && typeof data.type === "string") {
			return data as ServerMessage;
		}
		return null;
	} catch {
		return null;
	}
}
