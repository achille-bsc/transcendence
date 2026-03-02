import { useState } from "react";
import { verifToken } from "./script/utils";
import ChatInput from "./ChatInput";
import { useLang } from "./script/langProvider.tsx";
import RegisterButton from "./RegisterButton";

interface ChatInputBarProps {
	onMessageSent?: (message: string) => void;
	receiverPseudo?: string;
}

export default function ChatInputBar ({ onMessageSent, receiverPseudo = "try" }: ChatInputBarProps) {
	const [msg, setMsg] = useState("");
	const lang = useLang().getLang();
	
	async function sendMessage() {
		if (msg.trim() === '') {
			return;
		}
		
		const res = await fetch('/api/db/chat/dm', {
			method: 'POST',
			headers: {
				"Authorization": `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				receiverPseudo,
				content: msg,
			}),
		});

		const data = await res.json();

		console.log("response = ", data);

		if (!res.ok) {
			console.error("Something went wrong");
			return ;
		}
		const { content, sender, conversationId } = data.data;
		console.log("msg : ", content);
		console.log("sender : ", sender);
		console.log("conversationId : ", conversationId);
		const message = data.data.content;
		
		onMessageSent?.(message);
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

	async function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			event.preventDefault();
			await sendMessage();
		}
	}

	return (
		<div className="flex w-full items-center border bg-[var(--background-box)] border-[var(--default)] text-[var(--contrast)]">
				<ChatInput
					type="text"
					id="dialogue"
					name="text"
					value={msg}
					className="focus:outline-hidden w-full min-w-0 px-3 py-5 text-base placeholder-[var(--props)]"
					placeholder={lang.Chat_page.input}
					autoComplete="off"
					required
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMsg(event.target.value)}
					onKeyDown={onInputKeyDown}
					/>
				<RegisterButton
					icon="send"
					className="cursor-pointer p-2"
					onClick={sendMessage}
					/>
		</div>
	)
}
// xl:w-[89vw] 2xl:w-[92.5vw]
// content-end
// w-9.5 sm:w-8 
{/* <label className="flex p-5 -space-x-1">
				<ChatInput
					type="text"
					id="dialogue"
					name="text"
					className="focus:outline-hidden border-1 border-r-0 border-[var(--violet-default)] py-2 p-2 sm:p-2.5 text-sm sm:text-base bg-[var(--background-box)] placeholder-[var(--props)] border-[var(--violet-default)] text-[var(--white)]"
					placeholder={lang.Chat_page.input}
					autoComplete="off"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMsg(e.target.value)}
					required
					onKeyDown={SendMsg}
					/>
				<RegisterButton
					icon="send"
					className="w-9.5 sm:w-8 border-l-0 border-1 p-2 sm:p-1 bg-[var(--background-box)] h-9.5 sm:h-11.5"
					onClick={SendMsg}
					/>
		</label> */}
