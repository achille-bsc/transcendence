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
			<div className="bg-[#1E1E1E] min-h-screen flex items-end justify-center text-[#6E3CA3]">
				<label className="flex justify-center p-5">
					<ChatInput
						type="text"
						id="dialogue"
						name="text"
						className="w-full border border-[#6E3CA3] p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B]  border-[#6E3CA3] text-[#ffffff]"
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
