/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   WebSocketClient.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abosc <abosc@student.42lehavre.fr>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/21 14:31:54 by abosc             #+#    #+#             */
/*   Updated: 2026/03/12 12:02:45 by abosc            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


export type WSEventMap = {
	open: Event;
	close: CloseEvent;
	error: Event;
	message: MessageEvent;
};

export type WSListener<K extends keyof WSEventMap> = (event: WSEventMap[K]) => void;

export interface WebSocketClientOptions {
	url: string;
	maxReconnectAttempts?: number;
	reconnectDelay?: number;
}

export class WebSocketClient {
	private ws: WebSocket | null = null;
	private url: string;
	private maxReconnectAttempts: number;
	private reconnectDelay: number;
	private reconnectAttempts = 0;
	private intentionalClose = false;
	private listeners: { [K in keyof WSEventMap]?: Set<WSListener<K>> } = {};

	constructor(options: WebSocketClientOptions) {
		this.url = options.url;
		this.maxReconnectAttempts = options.maxReconnectAttempts ?? 5;
		this.reconnectDelay = options.reconnectDelay ?? 1000;
	}

	// Connection handling
	connect(): void {
		try {
			this.intentionalClose = false;
			this.ws = new WebSocket(this.url);

			this.ws.onopen = (e) => {
				this.reconnectAttempts = 0;
				this.emit("open", e);
			};

			this.ws.onmessage = (e) => {
				this.emit("message", e);
			};

			this.ws.onclose = (e) => {
				this.emit("close", e);
				if (!this.intentionalClose) {
					this.attemptReconnect();
				}
			};

			this.ws.onerror = (e) => {
				this.emit("error", e);
			};
		} catch (error) {
			console.log(`WebSocket connection failed: ${error}\nThis error has correctly been handled`);
		}
		
	}

	disconnect(): void {
		this.intentionalClose = true;
		this.reconnectAttempts = 0;
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
	}

	send(data: object | string): boolean {
		if (this.ws?.readyState === WebSocket.OPEN) {
			const message = typeof data === "string" ? data : JSON.stringify(data);
			this.ws.send(message);
			return true;
		}
		return false;
	}

	get isConnected(): boolean {
		return this.ws?.readyState === WebSocket.OPEN;
	}

	get readyState(): number {
		return this.ws?.readyState ?? WebSocket.CLOSED;
	}

	private attemptReconnect(): void {
		if (this.reconnectAttempts >= this.maxReconnectAttempts) {
			return;
		}
		this.reconnectAttempts++;
		const delay = this.reconnectDelay * this.reconnectAttempts;
		setTimeout(() => {
			if (!this.intentionalClose) {
				this.connect();
			}
		}, delay);
	}

	get currentReconnectAttempt(): number {
		return this.reconnectAttempts;
	}

	get maxReconnectAttemptsValue(): number {
		return this.maxReconnectAttempts;
	}

	// Events handling
	on<K extends keyof WSEventMap>(event: K, listener: WSListener<K>): void {
		if (!this.listeners[event]) {
			(this.listeners[event] as unknown as Set<WSListener<K>>) = new Set();
		}
		(this.listeners[event] as Set<WSListener<K>>).add(listener);
	}

	off<K extends keyof WSEventMap>(event: K, listener: WSListener<K>): void {
		(this.listeners[event] as Set<WSListener<K>> | undefined)?.delete(listener);
	}

	private emit<K extends keyof WSEventMap>(event: K, data: WSEventMap[K]): void {
		const set = this.listeners[event] as Set<WSListener<K>> | undefined;
		set?.forEach((listener) => listener(data));
	}

	destroy(): void {
		this.disconnect();
		this.listeners = {};
	}
}
