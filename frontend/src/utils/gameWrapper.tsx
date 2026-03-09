/**
 * KongGameComponent.tsx
 *
 * Composant React wrapper pour le module KongGame.
 * 
 * === INSTALLATION ===
 * Dans votre projet React, à la racine :
 *   npm install ../ft_transcendence_front   (chemin relatif vers ce repo)
 *   -- ou --
 *   npm link ft_transcendence_front          (après avoir fait `npm link` ici)
 *
 * === USAGE ===
 *   import { KongGameComponent } from "./KongGameComponent";
 *
 *   <KongGameComponent
 *     wsUrl="ws://localhost:3000/ws"
 *     userToken="mon-token"
 *     userId="user-123"
 *   />
 */

import { useRef, useEffect, useCallback } from "react";
import { KongGame } from "kongGameFront";
import type { KongGameConfig, KongGameEventMap } from "kongGameFront";
import "kongGameFront/style.css";

/* ─── Props ────────────────────────────────────────────────────────────── */

type KongEventHandlers = {
	[K in keyof KongGameEventMap as `on${Capitalize<K>}`]?: (
		data: KongGameEventMap[K],
	) => void;
};

export interface KongGameComponentProps
	extends Omit<KongGameConfig, "canvasWidth" | "canvasHeight">,
		KongEventHandlers {
	/** Largeur du canvas (défaut : 800) */
	width?: number;
	/** Hauteur du canvas (défaut : 600) */
	height?: number;
	/** Classes CSS supplémentaires sur le conteneur */
	className?: string;
	/** Démarrage automatique (défaut : true) */
	autoStart?: boolean;
}

/* ─── Composant ────────────────────────────────────────────────────────── */

export function KongGameComponent({
	wsUrl,
	userToken,
	userId,
	width = 800,
	height = 600,
	maxReconnectAttempts,
	reconnectDelay,
	interpolationDelay,
	className,
	autoStart = true,
	onConnected,
	onDisconnected,
	onReconnecting,
	onReconnectFailed,
	onAuthenticated,
	onGameState,
	onGameCreated,
	onGameJoined,
	onError,
}: KongGameComponentProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const gameRef = useRef<KongGame | null>(null);

	/* Initialisation + cleanup */
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const config: KongGameConfig = {
			wsUrl,
			userToken,
			userId,
			canvasWidth: width,
			canvasHeight: height,
			maxReconnectAttempts,
			reconnectDelay,
			interpolationDelay,
		};

		const game = new KongGame(container, config);
		gameRef.current = game;

		/* Brancher les événements */
		if (onConnected) game.on("connected", onConnected);
		if (onDisconnected) game.on("disconnected", onDisconnected);
		if (onReconnecting) game.on("reconnecting", onReconnecting);
		if (onReconnectFailed) game.on("reconnectFailed", onReconnectFailed);
		if (onAuthenticated) game.on("authenticated", onAuthenticated);
		if (onGameState) game.on("gameState", onGameState);
		if (onGameCreated) game.on("gameCreated", onGameCreated);
		if (onGameJoined) game.on("gameJoined", onGameJoined);
		if (onError) game.on("error", onError);

		if (autoStart) {
			game.start();
		}

		return () => {
			game.destroy();
			gameRef.current = null;
		};
		// On ne dépend que de la config de connexion pour ne pas recréer le jeu
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wsUrl, userToken, userId, width, height]);

	/* Méthodes impératives exposées via ref (optionnel) */
	// const createGame = useCallback(
	// 	(gameId: string, difficulty?: "easy" | "medium" | "hard") => {
	// 		gameRef.current?.createGame(gameId, difficulty);
	// 	},
	// 	[],
	// );

	// const joinGame = useCallback(
	// 	(gameId: string, difficulty?: "easy" | "medium" | "hard") => {
	// 		gameRef.current?.joinGame(gameId, difficulty);
	// 	},
	// 	[],
	// );

	return (
		<div
			ref={containerRef}
			className={className}
			style={{ display: "inline-block" }}
		/>
	);
}

/* Pour un usage impératif via React.forwardRef, on peut aussi exporter le hook */
export function useKongGame() {
	const containerRef = useRef<HTMLDivElement>(null);
	const gameRef = useRef<KongGame | null>(null);

	const init = useCallback((config: KongGameConfig) => {
		if (!containerRef.current) return;
		if (gameRef.current) gameRef.current.destroy();

		const game = new KongGame(containerRef.current, config);
		gameRef.current = game;
		return game;
	}, []);

	const destroy = useCallback(() => {
		gameRef.current?.destroy();
		gameRef.current = null;
	}, []);

	useEffect(() => {
		return () => {
			gameRef.current?.destroy();
		};
	}, []);

	return { containerRef, gameRef, init, destroy };
}
