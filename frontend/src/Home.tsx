import '../node_modules/tailwindcss/index.css';
import './Home.css';
import Button from "./TryButton.tsx";
import { useState } from "react";
import { useLang } from './script/langProvider';
import { verifToken } from './script/utils';

async function Home () {
	// if (!(await verifToken(localStorage.getItem('token') || "any")))
	// {
	// 	window.location.href = "/log";
	// }
	const lang = useLang().getLang();

	return (
		<div className="quantico-regular bg-[#FFFFFF] dark:bg-[#1A1A1A] text-[#000000] dark:text-[#FFFFFF]">
			<div className="min-h-screen flex items-center justify-center">
				<div className="w-1/2 text-center p-4 sm:p-5">
					<p className="text-[50px] p-2">Kong's game</p>
					<div className="flex justify-center items-center">
						<Button
							className="cursor-pointer text-[25px] w-full sm:w-auto p-2 px-9 bg-linear-[90deg,#B78EE3,#E46868] dark:bg-linear-[90deg,#6E3CA3,#A82828] focus:outline-2 text-[#FFFFFF]"
							onClick={() => "game page"}
							label={lang.Home_page.play}
							/>
					</div>
					<p className="absolute bottom-15 left-2">{lang.Home_page.Friend_online}</p>
				</div>
			</div>
		</div>
	);
}

export default Home