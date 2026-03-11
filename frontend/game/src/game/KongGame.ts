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
import type { KongGameConfig, KongGameEventMap } from "../types";
import "../style.css";

type EventCallback<T> = (data: T) => void;

const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = 600;

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

	createGame(gameId: string, difficulty?: "easy" | "medium" | "hard"): void {
		this.network.createGame(difficulty, gameId);
	}

	joinGame(gameId: string, difficulty?: "easy" | "medium" | "hard"): void {
		this.network.joinGame(gameId, difficulty);
	}

	// DOM setup

	private setupDOM(): void {
		this.container.classList.add("kong-game-container");

		this.controlsEl = document.createElement("div");
		this.controlsEl.classList.add("kong-controls");
		this.controlsEl.innerHTML = `
			<div class="kong-mode-group">
				<select class="kong-select" data-input="gameMode">
					<option value="online"${(this.config.gameMode ?? "online") === "online" ? " selected" : ""}>Online</option>
					<option value="local"${this.config.gameMode === "local" ? " selected" : ""}>Local (2 joueurs)</option>
				</select>
			</div>
			<button class="kong-btn kong-btn--create" data-action="create">Créer une partie</button>
			<button class="kong-btn kong-btn--join" data-action="join">Rejoindre</button>
			<select class="kong-select" data-input="difficulty">
				<option value="easy">Facile</option>
				<option value="medium" selected>Normal</option>
				<option value="hard">Difficile</option>
			</select>
		`;
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
		this.statusEl.textContent = "Connexion…";
		this.container.appendChild(this.statusEl);

		this.renderer = new GameRenderer(this.canvas);
	}

	private setupControlEvents(): void {
		const getDifficulty = (): "easy" | "medium" | "hard" => {
			const select = this.controlsEl.querySelector<HTMLSelectElement>('[data-input="difficulty"]');
			return (select?.value as "easy" | "medium" | "hard") || "medium";
		};

		this.controlsEl.querySelector('[data-action="create"]')?.addEventListener("click", () => {
			const input = this.controlsEl.querySelector<HTMLInputElement>('[data-input="gameId"]');
			const gameId = input?.value.trim() || this.config.userId;
			this.createGame(gameId, getDifficulty());
		});

		this.controlsEl.querySelector('[data-action="join"]')?.addEventListener("click", () => {
			this.joinGame('', getDifficulty());
		});

		this.controlsEl.querySelector('[data-action="applyDev"]')?.addEventListener("click", () => {
			const tokenInput = this.controlsEl.querySelector<HTMLInputElement>('[data-input="devToken"]');
			const userIdInput = this.controlsEl.querySelector<HTMLInputElement>('[data-input="devUserId"]');
			const token = tokenInput?.value.trim();
			const userId = userIdInput?.value.trim();
			if (token || userId) {
				if (token) this.network.setToken(token);
				if (userId) this.network.setUserId(userId);
				const parts = [token ? "token" : "", userId ? "userId" : ""].filter(Boolean).join(" + ");
				this.setStatus(`Dev ${parts} appliqué — Reconnexion…`, "warning");
				this.network.disconnect();
				this.network.connect();
			}
		});

		this.controlsEl.querySelector('[data-input="gameMode"]')?.addEventListener("change", (e) => {
			const select = e.target as HTMLSelectElement;
			const newMode = select.value as "local" | "online";
			this.switchMode(newMode);
		});
	}

	private setupNetworkEvents(): void {
		this.network.on("connected", () => {
			this.setStatus("Connecté — Authentification…", "info");
			this.emit("connected", undefined as void);
		});

		this.network.on("authenticated", (msg) => {
			this.setStatus("Authentifié ✓", "success");
			this.emit("authenticated", msg);
		});

		this.network.on("gameState", (msg) => {
			this.state.updateFromServer(msg);
			this.emit("gameState", msg);
		});

		this.network.on("gameCreated", (msg) => {
			this.state.clearWinner();
			this.setStatus(`Partie créée : ${msg.gameId}`, "success");
			this.emit("gameCreated", msg);
		});

		this.network.on("gameJoined", (msg) => {
			this.state.clearWinner();
			this.setStatus(`Rejoint : ${msg.gameId}`, "success");
			this.emit("gameJoined", msg);
		});

		this.network.on("disconnected", (data) => {
			this.setStatus("Déconnecté", "error");
			this.emit("disconnected", data);
		});

		this.network.on("reconnecting", (data) => {
			this.setStatus(
				`Reconnexion ${data.attempt}/${data.maxAttempts}…`,
				"warning",
			);
			this.emit("reconnecting", data);
		});

		this.network.on("reconnectFailed", () => {
			this.setStatus("Reconnexion impossible", "error");
			this.emit("reconnectFailed", undefined as unknown as void);
		});

		this.network.on("error", (err) => {
			this.emit("error", err);
		});
	}

	private switchMode(mode: "local" | "online"): void {
		this.config = { ...this.config, gameMode: mode };
		this.network.setGameMode(mode);

		this.input.destroy();
		const playerIds = mode === "local"
			? [this.config.userId, this.config.localPlayer2Id ?? this.config.userId + "_local"]
			: [this.config.userId];
		this.input = new GameInput(
			{ onAction: (action: InputAction, localPlayerId: string) => this.handleInput(action, localPlayerId) },
			mode,
			playerIds,
		);
		if (this.isRunning) {
			this.input.attach();
		}

		const label = mode === "local" ? "Local (2 joueurs)" : "Online";
		this.setStatus(`Mode : ${label}`, "info");
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
				this.renderer.renderVictory(winner);
			} else if (this.state.playerCount > 0) {
				this.state.tick(dt);
				this.renderer.render(this.state.getRenderPlayers(), this.state.getPlatforms(), this.state.getBarils(), this.state.getGoalPoint());
			} else if (this.network.isConnected) {
				this.renderer.renderWaiting("En attente de joueurs…");
			} else {
				this.renderer.renderDisconnected();
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
