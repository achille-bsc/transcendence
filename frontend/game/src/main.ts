/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/12 14:33:57 by abosc             #+#    #+#             */
/*   Updated: 2026/02/22 14:46:05 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { KongGame } from "./game/KongGame";

const container = document.getElementById("kong-game");
if (!container) {
	throw new Error("Container #kong-game not foundable int the DOM");
}

const game = new KongGame(container, {
	wsUrl: "ws://localhost:3000/ws",
	userToken: localStorage.getItem("token") || "42token",
	userId: "dev-user",
	canvasWidth: 800,
	canvasHeight: 600,
});

// TODO: remove for production and final version
game.on("connected", () => console.log("[Kong] Connecté"));
game.on("disconnected", (d) => console.log("[Kong] Déconnecté:", d.code, d.reason));
game.on("authenticated", (m) => console.log("[Kong] Auth:", m));
game.on("gameState", () => {});
game.on("error", (e) => console.error("[Kong] Erreur:", e));

game.start();

// Cleanup au reload (HMR Vite)
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

