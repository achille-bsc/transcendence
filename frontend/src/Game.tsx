import '../node_modules/tailwindcss/index.css';
import './Home.css';
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
		<div className="quantico-regular bg-[#1A1A1A] text-[#FFFFFF]">
			<Main>
				<div className="absolute top-1/2 left-1/2">
					{lang.Game_page.description} <br />
					<button 
						className="cursor-pointer border-1 p-2 px-4 bg-[var(--background-header-light)]" 
						onClick={() => setI(i + 1)}>nb: {i}
					</button>
				</div>
			</Main>
		</div>
	);
}