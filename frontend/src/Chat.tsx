import { useState } from "react";
import { verifToken } from "./script/utils";
import ChatInput from "./ChatInput";
import Main from "./utils/Main.tsx"
import SendMsg from "./SendMsg";

function Chat () {

	// let isAuth = false;
	// const token = localStorage.getItem('token')
	// if (token)
	// {
	// 	if (!verifToken(token))
	// 	{
	// 		window.location.href = "/log";
	// 	}
	// 	else
	// 	{
	// 			isAuth = true;
	// 	}
	// }
	// else
	// 	window.location.href = "/log";

	const [msg, setMsg] = useState("");

	async function keyPressFunction(event: any) { // See it with API

		if (event.key == 'Enter'  && msg.trim() !== '')
		{
			console.log(msg);
			const data = JSON.stringify({
				// user_id: token,
				content: msg,
			})
			try {
				const response = await fetch('https://caddy:443/db/signin', {
					method: 'POST',
					headers: {
					'Content-Type': 'application/json'
					},
					body: data
				});
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
		<Main>
			<div className="bg-[var(--background)] min-h-screen flex items-end justify-center text-[var(--violet-default)]">
				<label className="flex justify-center p-5">
					<ChatInput
						type="text"
						id="dialogue"
						name="text"
						className="w-full border border-[var(--violet-default)] p-2 sm:p-2.5 text-sm sm:text-base bg-[var(--background-box)] placeholder-[var(--props)] border-[var(--violet-default)] text-[var(--props)]"
						placeholder="type your text"
						autoComplete="off"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMsg(e.target.value)}
						required
						onKeyDown={keyPressFunction}
						/>
				</label>
			</div>
		</Main>
	)
}


export default Chat
