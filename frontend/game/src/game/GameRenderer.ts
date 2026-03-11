/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   GameRenderer.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/21 13:43:26 by abosc             #+#    #+#             */
/*   Updated: 2026/03/11 17:33:31 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { mapPlatform } from "../types";
import { getAngleRad } from "../utils/utils";
import type { RenderPlayer, RenderBaril } from "./GameState";

const PLAYER_COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f"];
const PLAYER_SIZE = 75;
const BARIL_SIZE = 30;
const GROUND_HEIGHT = 20;
const BG_COLOR = "#1a1a2e";
const GROUND_COLOR = "#16213e";

export class GameRenderer {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private width: number;
	private height: number;
	private playerImages: HTMLImageElement[];
	private barilImage: HTMLImageElement;
	private gateImage: HTMLImageElement;
	
	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Cannot get 2D context from canvas");
		this.ctx = ctx;
		this.width = canvas.width;
		this.height = canvas.height;
		
		this.playerImages = [];
		this.playerImages[0] = new Image();
		this.playerImages[0].src = "/assets/face1.png";
		this.playerImages[1] = new Image();
		this.playerImages[1].src = "/assets/face2.png";
		this.playerImages[2] = new Image();
		this.playerImages[2].src = "/assets/face3.png";
		this.playerImages[3] = new Image();
		this.playerImages[3].src = "/assets/face4.png";
		
		this.barilImage = new Image();
		this.barilImage.src = "/assets/baril.png";
		this.gateImage = new Image();
		this.gateImage.src = "/assets/gate.png";
	}

	resize(width: number, height: number): void {
		this.width = width;
		this.height = height;
		this.canvas.width = width;
		this.canvas.height = height;
	}
	render(players: RenderPlayer[], platforms: mapPlatform[], barils: RenderBaril[], goalPoint: { x: number, y: number }): void {
		this.clear();
		this.drawGround();
		this.drawPlayers(players);
		this.drawMap(platforms);
		this.drawBarils(barils);
		this.drawGoalPoint(goalPoint);
	}

	renderWaiting(message: string): void {
		this.clear();
		this.drawGround();
		this.ctx.fillStyle = "#ffffff";
		this.ctx.font = "20px monospace";
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(message, this.width / 2, this.height / 2);
	}

	renderDisconnected(): void {
		this.clear();
		this.ctx.fillStyle = "#e74c3c";
		this.ctx.font = "18px monospace";
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText("Déconnecté du serveur", this.width / 2, this.height / 2);
		this.ctx.fillStyle = "#ffffff88";
		this.ctx.font = "14px monospace";
		this.ctx.fillText(
			"Tentative de reconnexion...",
			this.width / 2,
			this.height / 2 + 30,
		);
	}

	renderVictory(winnerId: string): void {
		// Overlay semi-transparent
		this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
		this.ctx.fillRect(0, 0, this.width, this.height);

		// Titre "VICTOIRE"
		this.ctx.fillStyle = "#f1c40f";
		this.ctx.font = "bold 48px monospace";
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText("VICTOIRE !", this.width / 2, this.height / 2 - 40);

		// Message du gagnant
		this.ctx.fillStyle = "#ffffff";
		this.ctx.font = "24px monospace";
		this.ctx.fillText(`Joueur ${winnerId} a gagné !`, this.width / 2, this.height / 2 + 20);

		// Sous-texte
		this.ctx.fillStyle = "#ffffff88";
		this.ctx.font = "16px monospace";
		this.ctx.fillText("Créez une nouvelle partie pour rejouer", this.width / 2, this.height / 2 + 70);
	}

	private clear(): void {
		this.ctx.fillStyle = BG_COLOR;
		this.ctx.fillRect(0, 0, this.width, this.height);
	}

	private drawGround(): void {
		this.ctx.fillStyle = GROUND_COLOR;
		this.ctx.fillRect(
			0,
			this.height - GROUND_HEIGHT,
			this.width,
			GROUND_HEIGHT,
		);
	}

	private drawMap(platforms: mapPlatform[]): void {
		this.ctx.fillStyle = "#ffffff";
		platforms.forEach(platform => {
			platforms.forEach(platform => {
            const width = Math.hypot(platform.endX - platform.startX, platform.endY - platform.startY);
            const angle = getAngleRad(
                { x: platform.startX, y: platform.startY },
                { x: platform.endX, y: platform.endY }
            );

            this.ctx.save();
            // Translate vers le point de départ, puis rotate autour de ce point
            this.ctx.translate(platform.startX, platform.startY);
            this.ctx.rotate(angle);
            // Dessiner le rectangle à partir de l'origine locale (0, 0)
            this.ctx.fillRect(30, 35, width, GROUND_HEIGHT);
            this.ctx.restore();
        });
		});
	}

	private drawPlayers(players: RenderPlayer[]): void {
		players.forEach((player, index) => {
			this.drawPlayer(player, index % 4, );
		});
	}

	private drawPlayer(player: RenderPlayer, color: number): void {
		if (this.playerImages[color].complete && this.playerImages[color].naturalWidth > 0) {
			this.ctx.drawImage(this.playerImages[color], player.displayX, player.displayY - 20, PLAYER_SIZE, PLAYER_SIZE);
		}
		
		// this.ctx.fillRect(player.displayX, player.displayY, PLAYER_SIZE, PLAYER_SIZE);

		// if (player.isJumping) {
		// 	this.ctx.strokeStyle = "#ffffff44";
		// 	this.ctx.lineWidth = 2;
		// 	this.ctx.strokeRect(draw
		// 		player.displayX - 2,
		// 		player.displayY - 2,
		// 		PLAYER_SIZE + 4,
		// 		PLAYER_SIZE + 4,
		// 	);
		// }
	}

	private drawGoalPoint(point: { x: number, y: number }): void {
		if (this.gateImage.complete && this.gateImage.naturalWidth > 0) {
			this.ctx.drawImage(this.gateImage, point.x - 10, point.y - 25, 40, 40);
		} else {
			this.ctx.beginPath();
			this.ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
			this.ctx.fillStyle = "#2ecc71";
			this.ctx.fill();
		}
		this.ctx.closePath();
	}

	private drawBarils(barils: RenderBaril[]): void {
		if (this.barilImage.complete && this.barilImage.naturalWidth > 0) {
			barils.forEach(baril => {
				this.ctx.drawImage(this.barilImage, baril.displayX, baril.displayY, BARIL_SIZE * 2, BARIL_SIZE * 2);
			});
		} else {
			this.ctx.fillStyle = "#ff0000";
			barils.forEach(baril => {
				this.ctx.fillRect(baril.displayX, baril.displayY, BARIL_SIZE, BARIL_SIZE);
			});
		}
	}
}
