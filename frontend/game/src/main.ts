/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/12 14:33:57 by abosc             #+#    #+#             */
/*   Updated: 2026/03/10 19:07:42 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { KongGame } from "./game/KongGame";

const container = document.getElementById("kong-game");
if (!container) {
	throw new Error("Container #kong-game not foundable int the DOM");
}

const game = new KongGame(container, {
	wsUrl: "wss://kong-service:3000/ws",
	userToken: localStorage.getItem("token") || "42token",
	userId: "dev-user",
	canvasWidth: 800,
	canvasHeight: 600,
});

// TODO: remove for production and final version
game.on("connected", () => console.log("[Kong] Connected"));
game.on("disconnected", (d) => console.log("[Kong] Disconnected:", d.code, d.reason));
game.on("authenticated", (m) => console.log("[Kong] Auth:", m));
game.on("gameState", () => {});
game.on("error", (e) => console.error("[Kong] Error:", e));

game.start();

// Cleanup on reload (HMR Vite)
declare global {
	interface ImportMeta {
		readonly hot?: {
			dispose(callback: () => void): void;
		};
	}
}
if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		game.destroy();
	});
}

