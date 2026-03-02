import Sidebar from "./script/Sidebar_dm.tsx";
import Main from "./utils/Main.tsx"
import ChatInputBar from "./ChatInputBar";
import "./index.css";
import "./Home.css";
import { useState } from "react";

// import { useNavigate } from "react-router-dom";
// function ListeConversations() {
//   const navigate = useNavigate();
//
//   const openConversation = (id) => {
//     navigate(`/chat/${id}`);
//   };
//
//   return (
//     <button onClick={() => openConversation(12345)}>
//       Ouvrir
//     </button>
//   );
// }

export default function Conversation() {
	const [messages, setMessages] = useState<string[]>([]);

	function handleMessageSent(message: string) {
		setMessages((prev) => [...prev, message]);
	}

	return (
		<Main>
			<div className="flex quantico-regular h-[calc(100dvh-5rem)] min-h-0">
				<Sidebar className="flex-none" />
				<div className="m-3 flex min-h-0 flex-1 flex-col">
					<div className="flex-1 min-h-0 overflow-y-auto">
						<div className="flex flex-col gap-2">
							{messages.length === 0 && (
								<div className="bg-[var(--background-box)] p-2 text-[var(--contrast)]">
									Aucun message pour le moment
								</div>
							)}
							{messages.map((message, index) => (
								<div key={`${index}-${message}`} className="bg-[var(--background-box)] p-2 text-[var(--contrast)] border-[var(--default)] border">
									{message}
								</div>
							))}
						</div>
					</div>
					<div className="shrink-0 pt-2">
						<ChatInputBar onMessageSent={handleMessageSent} />
					</div>
				</div>
			</div>
		</Main>
	)
}