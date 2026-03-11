/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   GameNetworkLayer.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/21 13:49:48 by abosc             #+#    #+#             */
/*   Updated: 2026/03/11 17:55:59 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { WebSocketClient } from "./WebSocketClient";
import {
	buildAuthMessage,
	buildCreateGame,
	buildGoDown,
	buildGoLeft,
	buildGoRight,
	buildJoinGame,
	buildJump,
	parseServerMessage,
} from "./protocol";
import type {
	Difficulty,
	KongGameConfig,
	KongGameEventMap,
	ServerMessage,
} from "../types";

type GameMode = "local" | "online";

type EventCallback<T> = (data: T) => void;

export class GameNetworkLayer {
	private wsClient: WebSocketClient;
	private config: KongGameConfig;
	private gameMode: GameMode;
	private eventHandlers: {
		[K in keyof KongGameEventMap]?: Set<EventCallback<KongGameEventMap[K]>>;
	} = {};

	constructor(config: KongGameConfig) {
		this.config = config;
		this.gameMode = config.gameMode ?? "online";
		this.wsClient = new WebSocketClient({
			url: config.wsUrl,
			maxReconnectAttempts: config.maxReconnectAttempts,
			reconnectDelay: config.reconnectDelay,
		});

		this.setupListeners();
	}

	connect(): void {
		this.wsClient.connect();
	}

	disconnect(): void {
		this.wsClient.disconnect();
	}

	get isConnected(): boolean {
		return this.wsClient.isConnected;
	}
	setToken(token: string): void {
		this.config = { ...this.config, userToken: token };
	}

	setUserId(userId: string): void {
		this.config = { ...this.config, userId };
	}

	setGameMode(mode: GameMode): void {
		this.gameMode = mode;
	}

	createGame(difficulty: Difficulty = "medium", gameId: string): boolean {
		return this.wsClient.send(buildCreateGame(this.config.userId, gameId, difficulty, this.gameMode));
	}

	joinGame(gameId: string, difficulty: Difficulty = "medium"): boolean {
		console.log("Joining game with id:", gameId);
		return this.wsClient.send(
			buildJoinGame(this.config.userId, gameId, difficulty, this.gameMode),
		);
	}

	sendJump(localUserId?: string): boolean {
		return this.wsClient.send(buildJump(this.config.userId, this.gameMode, localUserId));
	}

	sendGoLeft(localUserId?: string): boolean {
		return this.wsClient.send(buildGoLeft(this.config.userId, this.gameMode, localUserId));
	}

	sendGoRight(localUserId?: string): boolean {
		return this.wsClient.send(buildGoRight(this.config.userId, this.gameMode, localUserId));
	}

	sendGoDown(localUserId?: string): boolean {
		return this.wsClient.send(buildGoDown(this.config.userId, this.gameMode, localUserId));
	}

	on<K extends keyof KongGameEventMap>(
		event: K,
		callback: EventCallback<KongGameEventMap[K]>,
	): void {
		if (!this.eventHandlers[event]) {
			(this.eventHandlers as Record<string, Set<EventCallback<unknown>>>)[event as string] =
				new Set();
		}
		(
			this.eventHandlers[event] as Set<EventCallback<KongGameEventMap[K]>>
		).add(callback);
	}

	off<K extends keyof KongGameEventMap>(
		event: K,
		callback: EventCallback<KongGameEventMap[K]>,
	): void {
		(
			this.eventHandlers[event] as
				| Set<EventCallback<KongGameEventMap[K]>>
				| undefined
		)?.delete(callback);
	}

	private emit<K extends keyof KongGameEventMap>(
		event: K,
		data: KongGameEventMap[K],
	): void {
		const set = this.eventHandlers[event] as
			| Set<EventCallback<KongGameEventMap[K]>>
			| undefined;
		set?.forEach((cb) => cb(data));
	}

	private setupListeners(): void {
		this.wsClient.on("open", () => {
			this.emit("connected", undefined as void);
			this.wsClient.send(
				buildAuthMessage(this.config.userId, this.config.userToken),
			);
		});

		this.wsClient.on("close", (e) => {
			this.emit("disconnected", { code: e.code, reason: e.reason });

			const attempt = this.wsClient.currentReconnectAttempt;
			const max = this.wsClient.maxReconnectAttemptsValue;
			if (attempt > 0 && attempt <= max) {
				this.emit("reconnecting", { attempt, maxAttempts: max });
			} else if (attempt >= max) {
				this.emit("reconnectFailed", undefined as void);
			}
		});

		this.wsClient.on("error", () => {
			this.emit("error", "WebSocket connection error");
		});

		this.wsClient.on("message", (e) => {
			this.handleMessage(e.data);
		});
	}

	private handleMessage(raw: string): void {
		const message: ServerMessage | null = parseServerMessage(raw);
		if (!message) {
			this.emit("error", `Invalid message received: ${raw}`);
			return;
		}

		switch (message.type) {
			case "gameState":
				this.emit("gameState", message);
				break;
			case "auth_response":
				this.emit("authenticated", message);
				break;
			case "gameCreated":
				this.emit("gameCreated", message);
				break;
			case "gameJoined":
				this.emit("gameJoined", message);
				break;
			case "error":
				this.emit("error", message.message);
				break;
		}
	}

	destroy(): void {
		this.wsClient.destroy();
		this.eventHandlers = {};
	}
}
