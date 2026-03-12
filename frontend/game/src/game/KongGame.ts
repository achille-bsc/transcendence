/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   KongGame.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/21 14:31:34 by abosc             #+#    #+#             */
/*   Updated: 2026/03/11 17:39:38 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


import { GameNetworkLayer } from "../network/GameNetworkLayer";
import { GameState } from "./GameState";
import { GameRenderer } from "./GameRenderer";
import { GameInput, type InputAction } from "./GameInput";
import type { KongGameConfig, KongGameEventMap, KongGameTranslations } from "../types";
import "../style.css";

type EventCallback<T> = (data: T) => void;

const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = 600;
const DEFAULT_TRANSLATIONS: KongGameTranslations = {
	createButton: "Create a game",
	joinButton: "Join",
	connecting: "Connecting…",
	connectedAuthenticating: "Connected — Authenticating…",
	authenticated: "Authenticated ✓",
	gameCreated: "Game created: {gameId}",
	gameJoined: "Joined: {gameId}",
	disconnected: "Disconnected",
	reconnecting: "Reconnecting {attempt}/{maxAttempts}…",
	reconnectFailed: "Reconnection failed",
	waitingPlayers: "Waiting for players…",
	disconnectedFromServer: "Disconnected from server",
	attemptingReconnect: "Attempting to reconnect...",
	victoryTitle: "VICTORY!",
	playerWon: "Player {winnerId} won!",
	playAgain: "Create a new game to play again",
};

export class KongGame {
	private container: HTMLElement;
	private canvas!: HTMLCanvasElement;
	private statusEl!: HTMLElement;
	private controlsEl!: HTMLElement;
	private config: KongGameConfig;

	private network: GameNetworkLayer;
	private state: GameState;
	private renderer!: GameRenderer;
	private input: GameInput;

	private animFrameId: number | null = null;
	private isRunning = false;

	private eventHandlers: {
		[K in keyof KongGameEventMap]?: Set<EventCallback<KongGameEventMap[K]>>;
	} = {};
	private currentStatusState:
		| {
				key: keyof KongGameTranslations;
				level: "info" | "success" | "warning" | "error";
				replacements?: Record<string, string>;
		  }
		| null = null;

	private updateControlLabels(): void {
		this.controlsEl
			.querySelector<HTMLButtonElement>('[data-action="create"]')
			?.replaceChildren(this.tr("createButton"));
		this.controlsEl
			.querySelector<HTMLButtonElement>('[data-action="join"]')
			?.replaceChildren(this.tr("joinButton"));
	}

	private tr(key: keyof KongGameTranslations): string {
		return this.config.translations?.[key] ?? DEFAULT_TRANSLATIONS[key];
	}

	private trf(
		key: keyof KongGameTranslations,
		replacements?: Record<string, string>,
	): string {
		let text = this.tr(key);
		if (!replacements) return text;
		Object.entries(replacements).forEach(([token, value]) => {
			text = text.replace(`{${token}}`, value);
		});
		return text;
	}

	private setTranslatedStatus(
		key: keyof KongGameTranslations,
		level: "info" | "success" | "warning" | "error",
		replacements?: Record<string, string>,
	): void {
		this.currentStatusState = { key, level, replacements };
		this.setStatus(this.trf(key, replacements), level);
	}

	constructor(container: HTMLElement, config: KongGameConfig) {
		this.container = container;
		this.config = config;

		this.network = new GameNetworkLayer(config);
		this.state = new GameState(config.interpolationDelay);

		const mode = config.gameMode ?? "online";
		const playerIds = mode === "local"
			? [config.userId, config.localPlayer2Id ?? config.userId + "_local"]
			: [config.userId];
		this.input = new GameInput(
			{ onAction: (action: InputAction, localPlayerId: string) => this.handleInput(action, localPlayerId) },
			mode,
			playerIds,
		);
		
		this.setupDOM();
		this.setupNetworkEvents();
	}

	start(): void {
		if (this.isRunning) return;
		this.isRunning = true;
		this.network.connect();
		this.input.attach();
		this.startRenderLoop();
	}

	stop(): void {
		this.isRunning = false;
		this.stopRenderLoop();
		this.input.detach();
		this.network.disconnect();
	}

	destroy(): void {
		this.stop();
		this.network.destroy();
		this.input.destroy();
		this.state.reset();
		this.container.innerHTML = "";
		this.eventHandlers = {};
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

	createGame(gameId: string): void {
		this.network.createGame(undefined, gameId);
	}

	joinGame(gameId: string): void {
		this.network.joinGame(gameId, undefined);
	}

	updateTranslations(translations?: Partial<KongGameTranslations>): void {
		this.config = { ...this.config, translations };
		this.updateControlLabels();
		if (this.currentStatusState) {
			this.setStatus(
				this.trf(
					this.currentStatusState.key,
					this.currentStatusState.replacements,
				),
				this.currentStatusState.level,
			);
		}
	}

	// DOM setup

	private setupDOM(): void {
		this.container.classList.add("kong-game-container");

		this.controlsEl = document.createElement("div");
		this.controlsEl.classList.add("kong-controls");
		this.controlsEl.innerHTML = `
			<button class="kong-btn kong-btn--create" data-action="create">${this.tr("createButton")}</button>
			<button class="kong-btn kong-btn--join" data-action="join">${this.tr("joinButton")}</button>
		`;
		this.updateControlLabels();
		this.container.appendChild(this.controlsEl);
		this.setupControlEvents();

		// Canvas
		this.canvas = document.createElement("canvas");
		this.canvas.classList.add("kong-canvas");
		this.canvas.width = this.config.canvasWidth ?? DEFAULT_CANVAS_WIDTH;
		this.canvas.height = this.config.canvasHeight ?? DEFAULT_CANVAS_HEIGHT;
		this.container.appendChild(this.canvas);

		// Status bar
		this.statusEl = document.createElement("div");
		this.statusEl.classList.add("kong-status");
		this.container.appendChild(this.statusEl);
		this.setTranslatedStatus("connecting", "info");

		this.renderer = new GameRenderer(this.canvas);
	}

	private setupControlEvents(): void {
		this.controlsEl.querySelector('[data-action="create"]')?.addEventListener("click", () => {
			const gameId = this.config.userId;
			this.createGame(gameId);
		});

		this.controlsEl.querySelector('[data-action="join"]')?.addEventListener("click", () => {
			this.joinGame('');
		});
	}

	private setupNetworkEvents(): void {
		this.network.on("connected", () => {
			this.setTranslatedStatus("connectedAuthenticating", "info");
			this.emit("connected", undefined as void);
		});

		this.network.on("authenticated", (msg) => {
			this.setTranslatedStatus("authenticated", "success");
			this.emit("authenticated", msg);
		});

		this.network.on("gameState", (msg) => {
			this.state.updateFromServer(msg);
			this.emit("gameState", msg);
		});

		this.network.on("gameCreated", (msg) => {
			this.state.clearWinner();
			this.setTranslatedStatus("gameCreated", "success", {
				gameId: msg.gameId,
			});
			this.emit("gameCreated", msg);
		});

		this.network.on("gameJoined", (msg) => {
			this.state.clearWinner();
			this.setTranslatedStatus("gameJoined", "success", {
				gameId: msg.gameId,
			});
			this.emit("gameJoined", msg);
		});

		this.network.on("disconnected", (data) => {
			this.setTranslatedStatus("disconnected", "error");
			this.emit("disconnected", data);
		});

		this.network.on("reconnecting", (data) => {
			this.setTranslatedStatus("reconnecting", "warning", {
				attempt: String(data.attempt),
				maxAttempts: String(data.maxAttempts),
			});
			this.emit("reconnecting", data);
		});

		this.network.on("reconnectFailed", () => {
			this.setTranslatedStatus("reconnectFailed", "error");
			this.emit("reconnectFailed", undefined as unknown as void);
		});

		this.network.on("error", (err) => {
			this.emit("error", err);
		});
	}

	// inputs handling
	private handleInput(action: InputAction, localPlayerId: string): void {
		switch (action) {
			case "jump":
				this.network.sendJump(localPlayerId);
				break;
			case "goLeft":
				this.network.sendGoLeft(localPlayerId);
				break;
			case "goRight":
				this.network.sendGoRight(localPlayerId);
				break;
			case "goDown":
				this.network.sendGoDown(localPlayerId);
				break;
		}
	}

	private startRenderLoop(): void {
		let lastTime = performance.now();

		console.log("coucou");
		const loop = (now: number) => {
			if (!this.isRunning) return;

			const dt = (now - lastTime) / 1000;
			lastTime = now;
			this.input.update();

			const winner = this.state.getWinner();
			if (winner) {
				this.state.tick(dt);
				this.renderer.render(this.state.getRenderPlayers(), this.state.getPlatforms(), this.state.getBarils(), this.state.getGoalPoint());
				this.renderer.renderVictory(winner, {
					victoryTitle: this.tr("victoryTitle"),
					playerWon: this.tr("playerWon"),
					playAgain: this.tr("playAgain"),
				});
			} else if (this.state.playerCount > 0) {
				this.state.tick(dt);
				this.renderer.render(this.state.getRenderPlayers(), this.state.getPlatforms(), this.state.getBarils(), this.state.getGoalPoint());
			} else if (this.network.isConnected) {
				this.renderer.renderWaiting(this.tr("waitingPlayers"));
			} else {
				this.renderer.renderDisconnected({
					disconnectedFromServer: this.tr("disconnectedFromServer"),
					attemptingReconnect: this.tr("attemptingReconnect"),
				});
			}

			this.animFrameId = requestAnimationFrame(loop);
		};
		this.animFrameId = requestAnimationFrame(loop);
	}

	private stopRenderLoop(): void {
		if (this.animFrameId !== null) {
			cancelAnimationFrame(this.animFrameId);
			this.animFrameId = null;
		}
	}

	private setStatus(
		text: string,
		level: "info" | "success" | "warning" | "error",
	): void {
		this.statusEl.textContent = text;
		this.statusEl.className = `kong-status kong-status--${level}`;
	}

	// event emitter
	private emit<K extends keyof KongGameEventMap>(
		event: K,
		data: KongGameEventMap[K],
	): void {
		const set = this.eventHandlers[event] as
			| Set<EventCallback<KongGameEventMap[K]>>
			| undefined;
		set?.forEach((cb) => cb(data));
	}
}
