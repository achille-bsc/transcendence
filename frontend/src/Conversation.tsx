import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./script/Sidebar_dm.tsx";
import Main from "./utils/Main.tsx";
import ChatInputBar, { type ChatMessage } from "./ChatInputBar";
import { useLang } from "./script/langProvider";

interface DmConversation {
	id: number | null;
	messages: ChatMessage[];
}

interface Friend {
	pseudo: string;
}

type SocketPayload = {
	type: string;
	data?: ChatMessage;
};

type MessageGroup = {
	senderPseudo: string;
	isMine: boolean;
	messages: ChatMessage[];
};
const GROUP_WINDOW_MS = 5 * 60 * 1000;
const PAGE_SIZE = 50;
const TOP_PRELOAD_THRESHOLD_PX = 120;

function toTimestamp(value: string): number {
	const timestamp = new Date(value).getTime();
	return Number.isFinite(timestamp) ? timestamp : 0;
}

function compareMessageOrder(a: ChatMessage, b: ChatMessage): number {
	const aTime = toTimestamp(a.createdAt);
	const bTime = toTimestamp(b.createdAt);
	if (aTime !== bTime) {
		return aTime - bTime;
	}
	return a.id - b.id;
}

function dedupeById(list: ChatMessage[]): ChatMessage[] {
	const unique = new Map<number, ChatMessage>();
	for (const item of list) {
		unique.set(item.id, item);
	}
	return Array.from(unique.values());
}

async function fetchFriends(): Promise<Friend[]> {
	const token = localStorage.getItem("token");
	if (!token) {
		return [];
	}

	const response = await fetch("/user/friend", {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const data = await response.json();
	if (data.success === false || !Array.isArray(data.friends)) {
		return [];
	}

	return data.friends
		.map((friend: any) => {
			const pseudo =
				friend?.pseudo ??
				friend?.username ??
				friend?.requester?.pseudo ??
				friend?.addressee?.pseudo ??
				"";
			return { pseudo };
		})
		.filter((friend: Friend) => friend.pseudo.trim() !== "");
}

function buildMessageGroups(sortedMessages: ChatMessage[], myPseudo: string): MessageGroup[] {
	const groups: MessageGroup[] = [];
	for (const message of sortedMessages) {
		const isMine = message.sender.pseudo === myPseudo;
		const lastGroup = groups[groups.length - 1];
		if (lastGroup && lastGroup.senderPseudo === message.sender.pseudo) {
			const lastInGroup = lastGroup.messages[lastGroup.messages.length - 1];
			const currentTs = toTimestamp(message.createdAt);
			const lastTs = toTimestamp(lastInGroup.createdAt);
			const canGroup =
				currentTs > 0 &&
				lastTs > 0 &&
				currentTs - lastTs <= GROUP_WINDOW_MS;
			if (canGroup) {
				lastGroup.messages.push(message);
				continue;
			}
		}
		groups.push({
			senderPseudo: message.sender.pseudo,
			isMine,
			messages: [message],
		});
	}
	return groups;
}

function formatMessageTime(value: string): string {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "";
	}
	return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function toDayKey(value: string): string {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "";
	}
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function formatDayLabel(value: string): string {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "";
	}
	return date.toLocaleDateString([], {
		weekday: "short",
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

function getPseudoFromToken(): string {
	const token = localStorage.getItem("token");
	if (!token) {
		return "";
	}
	try {
		const payload = token.split(".")[1];
		if (!payload) {
			return "";
		}
		const decoded = JSON.parse(atob(payload)) as { pseudo?: string };
		return decoded.pseudo ?? "";
	} catch {
		return "";
	}
}

export default function Conversation() {
	const lang = useLang().getLang();
	const navigate = useNavigate();
	const { pseudo } = useParams();
	const receiverPseudo = useMemo(
		() => decodeURIComponent(pseudo ?? ""),
		[pseudo]
	);
	const [isReceiverAllowed, setIsReceiverAllowed] = useState(true);
	const [isReceiverGuardReady, setIsReceiverGuardReady] = useState(false);
	const myPseudo = useMemo(() => getPseudoFromToken(), []);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [isLoadingOlder, setIsLoadingOlder] = useState(false);
	const [hasOlderMessages, setHasOlderMessages] = useState(true);
	const orderedMessages = useMemo(
		() => [...messages].sort(compareMessageOrder),
		[messages]
	);
	const messageGroups = useMemo(
		() => buildMessageGroups(orderedMessages, myPseudo),
		[orderedMessages, myPseudo]
	);
	const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const shouldScrollToBottomRef = useRef(true);
	const isPrependingRef = useRef(false);
	const previousScrollHeightRef = useRef(0);
	const activeConversationIdRef = useRef<number | null>(null);
	const receiverPseudoRef = useRef(receiverPseudo);
	const olderRequestTokenRef = useRef(0);

	useEffect(() => {
		activeConversationIdRef.current = activeConversationId;
	}, [activeConversationId]);

	useEffect(() => {
		receiverPseudoRef.current = receiverPseudo;
		olderRequestTokenRef.current += 1;
		setIsLoadingOlder(false);
		isPrependingRef.current = false;
	}, [receiverPseudo]);

	useEffect(() => {
		let cancelled = false;

		const validateReceiver = async () => {
			if (receiverPseudo.trim() === "") {
				if (cancelled) {
					return;
				}
				setIsReceiverAllowed(true);
				setIsReceiverGuardReady(true);
				return;
			}

			setIsReceiverGuardReady(false);
			const friends = await fetchFriends();
			if (cancelled) {
				return;
			}

			const isAllowed = friends.some((friend) => friend.pseudo === receiverPseudo);
			setIsReceiverAllowed(isAllowed);
			setIsReceiverGuardReady(true);

			if (!isAllowed) {
				setMessages([]);
				setActiveConversationId(null);
				setHasOlderMessages(false);
				navigate("/dm", { replace: true });
			}
		};

		void validateReceiver();
		return () => {
			cancelled = true;
		};
	}, [navigate, receiverPseudo]);

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) {
			return;
		}

		if (isPrependingRef.current) {
			const delta = container.scrollHeight - previousScrollHeightRef.current;
			container.scrollTop += delta;
			isPrependingRef.current = false;
			return;
		}

		if (shouldScrollToBottomRef.current) {
			endOfMessagesRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
			shouldScrollToBottomRef.current = false;
			return;
		}

		const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
		if (distanceToBottom <= 140) {
			endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
		}
	}, [orderedMessages]);

	const loadOlderMessages = useCallback(async () => {
		const token = localStorage.getItem("token");
		const container = scrollContainerRef.current;
		if (
			!token ||
			!container ||
			!isReceiverGuardReady ||
			!isReceiverAllowed ||
			receiverPseudo.trim() === "" ||
			isLoadingOlder ||
			!hasOlderMessages
		) {
			return;
		}

		const oldestMessage = orderedMessages[0];
		if (!oldestMessage) {
			return;
		}

		const requestReceiverPseudo = receiverPseudo;
		const requestToken = ++olderRequestTokenRef.current;
		setIsLoadingOlder(true);
		previousScrollHeightRef.current = container.scrollHeight;
		isPrependingRef.current = true;

		try {
			const response = await fetch("/chat/find-dm", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					receiverPseudo,
					beforeId: oldestMessage.id,
					limit: PAGE_SIZE,
				}),
			});

			const payload = await response.json();
			if (payload.success === false || !payload.data) {
				if (
					requestToken !== olderRequestTokenRef.current ||
					receiverPseudoRef.current !== requestReceiverPseudo
				) {
					return;
				}
				isPrependingRef.current = false;
				return;
			}

			if (
				requestToken !== olderRequestTokenRef.current ||
				receiverPseudoRef.current !== requestReceiverPseudo
			) {
				return;
			}
			const conversation = payload.data as DmConversation;
			const olderMessages = [...conversation.messages].reverse();
			setHasOlderMessages(olderMessages.length === PAGE_SIZE);
			if (olderMessages.length === 0) {
				isPrependingRef.current = false;
				return;
			}
			setMessages((previous) => dedupeById([...olderMessages, ...previous]));
		} catch {
			if (
				requestToken !== olderRequestTokenRef.current ||
				receiverPseudoRef.current !== requestReceiverPseudo
			) {
				return;
			}
			isPrependingRef.current = false;
		} finally {
			if (
				requestToken === olderRequestTokenRef.current &&
				receiverPseudoRef.current === requestReceiverPseudo
			) {
				setIsLoadingOlder(false);
			}
		}
	}, [hasOlderMessages, isLoadingOlder, isReceiverAllowed, isReceiverGuardReady, orderedMessages, receiverPseudo]);

	useEffect(() => {
		if (!isReceiverGuardReady || !isReceiverAllowed) {
			return;
		}
		const token = localStorage.getItem("token");
		if (!token || receiverPseudo.trim() === "") {
			setMessages([]);
			setActiveConversationId(null);
			setHasOlderMessages(false);
			return;
		}

		const loadConversation = async () => {
			try {
				const response = await fetch("/chat/find-dm", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ receiverPseudo, limit: PAGE_SIZE }),
				});
				
				const payload = await response.json();
				if (payload.success === false || payload.error) {
					const errorMessage =
						typeof payload?.error === "string" ? payload.error : "";
					if (errorMessage === "Conversation not found") {
						shouldScrollToBottomRef.current = true;
						setMessages([]);
						setActiveConversationId(null);
						setHasOlderMessages(false);
						return;
					}
					// Si c'est une autre erreur, on peut lever une exception pour aller dans le catch
					throw new Error("Erreur lors de la récupération des messages");
				}

				// On a une réponse OK, on peut mettre à jour le state ici !
				const conversation = payload.data as DmConversation;
				const ordered = [...conversation.messages].reverse();
				shouldScrollToBottomRef.current = true;
				setMessages(ordered);
				setHasOlderMessages(conversation.messages.length === PAGE_SIZE);
				setActiveConversationId(conversation.id ?? null);
			} catch {
				// Le catch s'occupe des erreurs réseau ou des exceptions levées dans le try
				setMessages([]);
				setActiveConversationId(null);
				setHasOlderMessages(false);
				navigate("/dm", { replace: true });
			}
			};

		loadConversation();
	}, [isReceiverAllowed, isReceiverGuardReady, navigate, receiverPseudo]);

	const onMessagesScroll = useCallback(() => {
		const container = scrollContainerRef.current;
		if (!container || isLoadingOlder || !hasOlderMessages) {
			return;
		}
		if (container.scrollTop <= TOP_PRELOAD_THRESHOLD_PX) {
			void loadOlderMessages();
		}
	}, [hasOlderMessages, isLoadingOlder, loadOlderMessages]);

	useEffect(() => {
		if (!isReceiverGuardReady || !isReceiverAllowed) {
			return;
		}
		const token = localStorage.getItem("token");
		if (!token) {
			return;
		}

		const protocol = window.location.protocol === "https:" ? "wss" : "ws";
		const ws = new WebSocket(
    		`${protocol}://${window.location.host}/chat/ws?token=${encodeURIComponent(token)}`
		);
		setSocket(ws);

		ws.onmessage = (event: MessageEvent<string>) => {
			let parsed: SocketPayload | string;
			try {
				parsed = JSON.parse(event.data);
				if (typeof parsed === "string") {
					parsed = JSON.parse(parsed) as SocketPayload;
				}
			} catch {
				return;
			}

			if (typeof parsed === "string" || parsed.type !== "NEW_MESSAGE" || !parsed.data) {
				return;
			}

				const incoming = parsed.data;
				const isForActivePeer =
					incoming.sender.pseudo === receiverPseudo ||
					incoming.sender.pseudo === myPseudo;
				const container = scrollContainerRef.current;
				const distanceToBottom = container
					? container.scrollHeight - container.scrollTop - container.clientHeight
					: Number.POSITIVE_INFINITY;
				if (incoming.sender.pseudo === myPseudo || distanceToBottom <= 140) {
					shouldScrollToBottomRef.current = true;
				}
				const currentActiveConversationId = activeConversationIdRef.current;
				const nextActiveConversationId =
					currentActiveConversationId === null && isForActivePeer
						? incoming.conversationId
						: currentActiveConversationId;

				if (currentActiveConversationId === null && isForActivePeer) {
					activeConversationIdRef.current = incoming.conversationId;
					setActiveConversationId(incoming.conversationId);
				}

				setMessages((previous) => {
					if (previous.some((msg) => msg.id === incoming.id)) {
						return previous;
					}

				if (
					nextActiveConversationId !== null &&
					incoming.conversationId !== nextActiveConversationId
				) {
					return previous;
				}

					if (
						nextActiveConversationId === null &&
						!isForActivePeer
					) {
						return previous;
					}

				return [...previous, incoming];
			});
		};

		return () => {
			setSocket(null);
			ws.close();
		};
		}, [isReceiverAllowed, isReceiverGuardReady, receiverPseudo, myPseudo]);

	return (
		<Main>
			<div className="conversation-layout">
				<Sidebar className="conversation-sidebar" />
				<div className="conversation-main">
						<div
							ref={scrollContainerRef}
							onScroll={onMessagesScroll}
							className="conversation-scroll"
						>
							<div className="conversation-stack">
								{isLoadingOlder && (
									<div className="conversation-loading">
											{lang.Chat_page.loading_older_messages}
									</div>
								)}
								{orderedMessages.length === 0 && (
									<div className="conversation-empty">
											{lang.Chat_page.no_messages_yet}
									</div>
								)}
									{messageGroups.map((group, groupIndex) => {
										const lastMessage = group.messages[group.messages.length - 1];
										const timeLabel = formatMessageTime(lastMessage.createdAt);
									const groupDayKey = toDayKey(group.messages[0].createdAt);
									const previousGroup = groupIndex > 0 ? messageGroups[groupIndex - 1] : null;
									const previousDayKey = previousGroup ? toDayKey(previousGroup.messages[0].createdAt) : "";
									const showDaySeparator = groupIndex === 0 || groupDayKey !== previousDayKey;
									const dayLabel = formatDayLabel(group.messages[0].createdAt);
									return (
										<div key={`${group.senderPseudo}-${groupIndex}-${lastMessage.id}`}>
											{showDaySeparator && dayLabel && (
												<div className="conversation-day-wrap">
													<div className="conversation-day-label">
														{dayLabel}
													</div>
												</div>
											)}
												<div className={`conversation-group-row ${group.isMine ? "conversation-group-row-mine" : "conversation-group-row-peer"}`} >
													<div className={`conversation-group-bounds ${group.isMine ? "conversation-group-bounds-mine" : "conversation-group-bounds-peer"}`}>
														{!group.isMine && (
															<div className="conversation-sender" onClick={() => window.location.href = `/profile/${group.senderPseudo}`}>
																{group.senderPseudo}
															</div>
														)}
														<div
															className={`conversation-bubble`}
														>
															<div className="conversation-bubble-content">
																{group.messages.map((message) => (
																	<p
																		key={message.id}
																		className="conversation-message-text"
																	>
																		{message.content}
																	</p>
																))}
															</div>
														{timeLabel && (
															<div className={`conversation-time ${group.isMine ? "conversation-time-mine" : "conversation-time-peer"}`}>
																{timeLabel}
															</div>
														)}
														</div>
													</div>
												</div>
											</div>
									);
								})}
								<div ref={endOfMessagesRef} />
							</div>
						</div>
					<div className="conversation-input-wrap">
						<ChatInputBar
							receiverPseudo={receiverPseudo}
							socket={socket}
						/>
					</div>
				</div>
			</div>
		</Main>
	);
}
