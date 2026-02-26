import { useState } from "react";
import { verifToken } from "./script/utils";
import ChatInput from "./ChatInput";
import { useLang } from "./script/langProvider.tsx";
import RegisterButton from "./RegisterButton";

export default function ChatInputBar ({pseudo}) {
	const [msg, setMsg] = useState("");
	const lang = useLang().getLang();
	
	async function sendMessage() { // See it with API
		console.log(pseudo);
		if (msg.trim() === '') {
			return;
		}
		
		const data = JSON.stringify({
			// receiverPseudo: pseudo,
			content: msg,
		});
		
		try {
			const response = await fetch('/api/db/chat/dm', {
				method: 'POST',
				headers: {
					"Authorization": `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				},
				body: data
			});
			console.log("response = ", response);
			if (!response.ok) {
				throw new Error('Something went wrong');
			}
			const result = await response.json();

			setMsg("");

			// const messages = result.msg;
			console.log(result);
		} catch (error)
		{
			console.error('Error:', error);
		}
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
			void sendMessage();
		}
	}

	return (
		<div className="flex w-full items-center border">
				<ChatInput
					type="text"
					id="dialogue"
					name="text"
					value={msg}
					className="focus:outline-hidden w-full min-w-0 px-3 py-5 text-base"
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
