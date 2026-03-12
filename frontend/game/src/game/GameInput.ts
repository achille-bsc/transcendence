/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   GameInput.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/21 14:31:41 by abosc             #+#    #+#             */
/*   Updated: 2026/03/12 13:23:16 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export type InputAction = "jump" | "goLeft" | "goRight" | "goDown";

export interface InputCallbacks {
	onAction: (action: InputAction, localPlayerId: string) => void;
}

// Online : toutes les touches → un seul joueur
const KEY_MAP_ALL: Record<string, InputAction> = {
	ArrowUp: "jump",
	ArrowLeft: "goLeft",
	ArrowRight: "goRight",
	// ArrowDown: "goDown",
	w: "jump",
	z: "jump",
	a: "goLeft",
	q: "goLeft",
	d: "goRight",
	// s: "goDown",
	" ": "jump",
};

// Local P1 : ZQSD / WASD
const KEY_MAP_P1: Record<string, InputAction> = {
	w: "jump",
	z: "jump",
	a: "goLeft",
	q: "goLeft",
	d: "goRight",
	// s: "goDown",
};

// Local P2: Arrow keys
const KEY_MAP_P2: Record<string, InputAction> = {
	ArrowUp: "jump",
	ArrowLeft: "goLeft",
	ArrowRight: "goRight",
	// ArrowDown: "goDown",
};

interface LocalPlayer {
	id: string;
	keyMap: Record<string, InputAction>;
	keysPressed: Set<string>;
}

export class GameInput {
	private callbacks: InputCallbacks;
	private boundKeyDown: (e: KeyboardEvent) => void;
	private boundKeyUp: (e: KeyboardEvent) => void;
	private players: LocalPlayer[];

	constructor(
		callbacks: InputCallbacks,
		mode: "online" | "local" = "online",
		playerIds: string[] = [],
	) {
		this.callbacks = callbacks;
		this.boundKeyDown = this.handleKeyDown.bind(this);
		this.boundKeyUp = this.handleKeyUp.bind(this);

		if (mode === "local" && playerIds.length >= 2) {
			this.players = [
				{ id: playerIds[0], keyMap: KEY_MAP_P1, keysPressed: new Set() },
				{ id: playerIds[1], keyMap: KEY_MAP_P2, keysPressed: new Set() },
			];
		} else {
			this.players = [
				{ id: playerIds[0] ?? "", keyMap: KEY_MAP_ALL, keysPressed: new Set() },
			];
		}
	}

	attach(): void {
		window.addEventListener("keydown", this.boundKeyDown);
		window.addEventListener("keyup", this.boundKeyUp);
	}

	detach(): void {
		window.removeEventListener("keydown", this.boundKeyDown);
		window.removeEventListener("keyup", this.boundKeyUp);
	}

	private handleKeyDown(e: KeyboardEvent): void {
		for (const player of this.players) {
			const action = player.keyMap[e.key];
			if (action) {
				e.preventDefault();
				if (!player.keysPressed.has(e.key)) {
					player.keysPressed.add(e.key);
					// Immediately send the first action (especially for jump)
					this.callbacks.onAction(action, player.id);
				}
				return;
			}
		}
	}

	private handleKeyUp(e: KeyboardEvent): void {
		for (const player of this.players) {
			player.keysPressed.delete(e.key);
		}
	}

	update(): void {
		for (const player of this.players) {
			for (const key of player.keysPressed) {
				const action = player.keyMap[key];
				if (action && action !== "jump") {
					this.callbacks.onAction(action, player.id);
				}
			}
		}
	}

	destroy(): void {
		this.detach();
		for (const player of this.players) {
			player.keysPressed.clear();
		}
	}
}
