import { useState } from "react";
import { verifToken } from "./script/utils";
import ChatInput from "./ChatInput";
import Main from "./utils/Main.tsx"
import SendMsg from "./SendMsg";
import { useLang } from "./script/langProvider.tsx";
import RegisterButton from "./RegisterButton";

function Chat () {

	let isAuth = false;
	const token = localStorage.getItem('token')
	if (token)
	{
		if (!verifToken(token))
		{
			window.location.href = "/log";
		}
		else
		{
				isAuth = true;
		}
	}
	else
		window.location.href = "/log";

	const [msg, setMsg] = useState("");
	const { getLang, setLang } = useLang();
	const lang = useLang().getLang();

	async function SendMsg(event: any) { // See it with API

		if (event.key == 'Enter' && msg.trim() !== '' || event.type === 'click' && msg.trim() !== '')
		{
			console.log(msg);
			const data = JSON.stringify({
				// user_id: token,
				content: msg,
			})
			try {
				const response = await fetch('/api/db/chat/dm', {
					method: 'POST',
					headers: {
					'Content-Type': 'application/json'
					},
					body: data
				});
				console.log("response = ", response);
				if (!response.ok) {
					throw new Error('Something went wrong');
				}
				const result = await response.json();
				console.log(result);
			} catch (error)
			{
				console.error('Error:', error);
			}

			console.log(msg);
		};
		// event.preventDefault();
	}

	return (
		<div className="bg-[var(--background)]">
			<Main>
				<div className="bg-[var(--background)] absolute inset-x-0 bottom-0 justify-center text-[var(--violet-default)]">
					<label className="flex p-5">
						<div className="flex items-center w-full">
							<ChatInput
								type="text"
								id="dialogue"
								name="text"
								className="flex  w-full focus:outline-hidden border border-[var(--violet-default)] py-2 p-2 sm:p-2.5 text-sm sm:text-base bg-[var(--background-box)] placeholder-[var(--props)] border-[var(--violet-default)] text-[var(--white)]"
								placeholder={lang.Chat_page.input}
								autoComplete="off"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMsg(e.target.value)}
								required
								onKeyDown={SendMsg}
								/>
							<RegisterButton
								icon="send"
								className="absolute right-6 w-9.5 sm:w-8 border-l-0 border-r-0 border-1 p-2 sm:p-1 bg-[var(--background-box)] h-9.5 sm:h-11.5"
								onClick={SendMsg}
								/>
						</div>
					</label>
				</div>
			</Main>
		</div>
	)
}

export default Chat