/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   GameState.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/21 14:31:28 by abosc             #+#    #+#             */
/*   Updated: 2026/03/11 17:33:31 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import type { PlayerState, KongGameState, Platform } from "../types";

export const MAX_PLAYERS = 4;
export const DEFAULT_LERP_SPEED = 0.1;

export interface RenderPlayer {
	id: string;
	targetX: number;
	targetY: number;
	displayX: number;
	displayY: number;
	isOnGround: boolean;
	isJumping: boolean;
}

export interface RenderBaril {
	id: string;
	targetX: number;
	targetY: number;
	displayX: number;
	displayY: number;
}

/**
 * Interpolation linéaire.
 */
function linear_interpolation(current: number, target: number, t: number): number {
	return current + (target - current) * t;
}

export class GameState {
	private players: Map<string, RenderPlayer> = new Map();
	private playerOrder: string[] = [];
	private barils: Map<string, RenderBaril> = new Map();
	private map: {
		platforms: Platform[],
		spawnPoint: { x: number, y: number },
		goalPoint: { x: number, y: number },
	} | null = null;
	private winner: string = '';

	private lerpSpeed: number;

	constructor(lerpSpeed: number = DEFAULT_LERP_SPEED) {
		this.lerpSpeed = lerpSpeed;
	}

	updateFromServer(message: KongGameState): void {
		if (message.winner) {
			this.winner = message.winner;
		}
		if (message.map)
		{
			this.map = {
				platforms: message.map.platforms,
				spawnPoint: message.map.spawnPoint,
				goalPoint: message.map.goalPoint,
			}
		}
		if (message.barils) {
			const incomingIds = new Set<string>();

			for (const [id, baril] of Object.entries(message.barils)) {
				incomingIds.add(id);
				const existing = this.barils.get(id);
				if (existing) {
					existing.targetX = baril.x;
					existing.targetY = baril.y;
				} else {
					this.barils.set(id, {
						id,
						targetX: baril.x,
						targetY: baril.y,
						displayX: baril.x,
						displayY: baril.y,
					});
				}
			}

			// Supprimer les barils disparus
			for (const id of this.barils.keys()) {
				if (!incomingIds.has(id)) {
					this.barils.delete(id);
				}
			}
		}
		for (const player of message.players) {
			const existing = this.players.get(player.id);

			if (existing) {
				existing.targetX = player.x;
				existing.targetY = player.y;
				existing.isOnGround = player.isOnGround;
				existing.isJumping = player.isJumping;
			} else {
				this.playerOrder.push(player.id);
				this.players.set(player.id, {
					id: player.id,
					targetX: player.x,
					targetY: player.y,
					displayX: player.x,
					displayY: player.y,
					isOnGround: player.isOnGround,
					isJumping: player.isJumping,
				});
			}
		}
	}

	tick(dt: number): void {
		const t = 1 - Math.pow(1 - this.lerpSpeed, dt * 60);

		for (const player of this.players.values()) {
			const dx = player.targetX - player.displayX;
			const dy = player.targetY - player.displayY;

			if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
				player.displayX = player.targetX;
				player.displayY = player.targetY;
			} else {
				player.displayX = linear_interpolation(player.displayX, player.targetX, t);
				player.displayY = linear_interpolation(player.displayY, player.targetY, t);
			}
		}
		for (const baril of this.barils.values()) {
			const dx = baril.targetX - baril.displayX;
			const dy = baril.targetY - baril.displayY;

			if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
				baril.displayX = baril.targetX;
				baril.displayY = baril.targetY;
			} else {
				baril.displayX = linear_interpolation(baril.displayX, baril.targetX, t);
				baril.displayY = linear_interpolation(baril.displayY, baril.targetY, t);
			}
		}
	}

	getRenderPlayers(): RenderPlayer[] {
		return this.playerOrder
			.map((id) => this.players.get(id))
			.filter((p): p is RenderPlayer => p !== undefined);
	}

	getPlayers(): PlayerState[] {
		return this.getRenderPlayers().map((p) => ({
			id: p.id,
			x: p.targetX,
			y: p.targetY,
			isOnGround: p.isOnGround,
			isJumping: p.isJumping,
		}));
	}

	getPlayerByIndex(index: number): PlayerState | null {
		const id = this.playerOrder[index];
		if (!id) return null;
		const p = this.players.get(id);
		if (!p) return null;
		return { id: p.id, x: p.targetX, y: p.targetY, isOnGround: p.isOnGround, isJumping: p.isJumping };
	}

	getPlayerById(id: string): PlayerState | null {
		const p = this.players.get(id);
		if (!p) return null;
		return { id: p.id, x: p.targetX, y: p.targetY, isOnGround: p.isOnGround, isJumping: p.isJumping };
	}

	getMap() {
		return this.map;
	}

	getPlatforms(): Platform[] {
		return this.map ? this.map.platforms : [];
	}

	getBarils(): RenderBaril[] {
		return Array.from(this.barils.values());
	}

	getSpawnPoint(): { x: number, y: number } {
		return this.map ? this.map.spawnPoint : { x: 0, y: 0 };
	}

	getGoalPoint(): { x: number, y: number } {
		return this.map ? this.map.goalPoint : { x: 0, y: 0 };
	}

	get playerCount(): number {
		return this.playerOrder.length;
	}

	getWinner(): string {
		return this.winner;
	}

	clearWinner(): void {
		this.winner = '';
	}

	reset(): void {
		this.players.clear();
		this.playerOrder = [];
		this.barils.clear();
		this.winner = '';
	}
}
