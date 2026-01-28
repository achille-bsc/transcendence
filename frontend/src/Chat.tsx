import { useState } from "react";
// import { verifToken } from "./script/utils";

function Chat () {

	// let isAuth = false;
	const token = localStorage.getItem('token')
	if (token)
	{
		// if (!verifToken(token))
		// {
		// 	window.location.href = "/log";
		// }
		// else
		// {
		// 		isAuth = true;
		// }
	}
	else
		window.location.href = "/log";

	const [msg, setMsg] = useState("");

	async function keyPressFunction(event: any) { // See it with API

		if (event.key == 'Enter')
		{
			const data = JSON.stringify({
				user_id: token,
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
	}

	return (
		<>
			<div className="bg-[#1E1E1E] min-h-screen flex items-end justify-center text-[#6E3CA3]">
				<label className="flex justify-center p-5">
					<input
						type="text"
						id="dialogue"
						name="text"
						className="w-full border border-[#6E3CA3] p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B] text-[#969696]"
						placeholder="type your text"
						onChange={e => setMsg(e.target.value)}
						required
						autoComplete="false"
						onKeyDown={keyPressFunction}
						/>
				</label>
			</div>
		</>
	)
}

export default Chat