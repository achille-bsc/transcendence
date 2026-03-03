import Button from "./TryButton.tsx";
import { useState } from "react";
import { useLang } from './script/langProvider';
import { verifToken } from './script/utils';
import Main from './utils/Main.tsx';

export default function Game () {
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
	const lang = useLang().getLang();
	const [i, setI] = useState(0);

	
	return (
		<div className="quantico-regular">
			<Main>
				<div className="game-content">
					{lang.Game_page.description} <br />
					<button 
						className="game-counter-btn" 
						onClick={() => setI(i + 1)}>nb: {i}
					</button>
				</div>
			</Main>
		</div>
	);
}
