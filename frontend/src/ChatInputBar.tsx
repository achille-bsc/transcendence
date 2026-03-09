import { useState } from "react";
import ChatInput from "./ChatInput";
import { useLang } from "./script/langProvider.tsx";
import RegisterButton from "./RegisterButton";

const MAX_DM_MESSAGE_LENGTH = 1000;

export interface ChatMessage {
	id: number;
	content: string;
	conversationId: number;
	createdAt: string;
	sender: {
		pseudo: string;
	};
}

interface ChatInputBarProps {
	receiverPseudo: string;
	socket: WebSocket | null;
}

export default function ChatInputBar ({ receiverPseudo, socket }: ChatInputBarProps) {
	const [msg, setMsg] = useState("");
	const lang = useLang().getLang();
	const canSend =
		msg.trim() !== "" &&
		receiverPseudo.trim() !== "" &&
		msg.length <= MAX_DM_MESSAGE_LENGTH;
	
	function sendMessage() {
		if (
			msg.trim() === "" ||
			receiverPseudo.trim() === "" ||
			msg.length > MAX_DM_MESSAGE_LENGTH
		) {
			return;
		}

		if (!socket || socket.readyState !== WebSocket.OPEN) {
			return;
		}

		socket.send(JSON.stringify({
			type: "SEND_DM",
			data: {
				receiverPseudo,
				content: msg,
			},
		}));
		setMsg("");
	}

// 		if (!res.ok) {
// 			alert(data.error || "Registration failed");
// 			return;
// 		}

// 		const data = await res.json();

// 		const token = data.token;
// 		localStorage.setItem("token", token);
// 		window.location.href = "/";
// 	}

	function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			event.preventDefault();
			sendMessage();
		}
	}

	return (
		<div className="dm-inputbar">
				<ChatInput
					type="text"
					id="dialogue"
					name="text"
					value={msg}
					className="dm-input-field"
					placeholder={lang.Chat_page.input}
					maxLength={MAX_DM_MESSAGE_LENGTH}
					autoComplete="off"
						required
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMsg(event.target.value)}
							onKeyDown={onInputKeyDown}
							/>
					<RegisterButton
						icon="send"
						className="dm-send-btn"
						onClick={sendMessage}
						disabled={!canSend}
						/>
		</div>
	)
}
