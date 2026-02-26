import '../node_modules/tailwindcss/index.css';
import './Home.css';
import Button from "./TryButton.tsx";
import { useState } from "react";
import { useLang } from './script/langProvider';
import { verifToken } from './script/utils';
import Main from './utils/Main.tsx';

function Home () {
	// if (!(await verifToken(localStorage.getItem('token') || "any")))
	// {
	// 	window.location.href = "/log";
	// }
	const lang = useLang().getLang();

	return (
		<div className="quantico-regular bg-[#1A1A1A] text-[#FFFFFF]">
			<Main>
				<div className="flex justify-center">
					<div className="w-1/2 text-center p-4 sm:p-5">
						<div className="absolute place-items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
							<p className="text-[50px] p-2">{lang.Home_page.game_name}</p>
							<div className="flex justify-center items-center">
								<Button
									className="cursor-pointer text-[25px] w-full sm:w-auto p-2 px-9 bg-linear-[90deg,#6E3CA3,#A82828] focus:outline-2 text-[#FFFFFF]"
									onClick={() => window.location.href = "/game"}
									label={lang.Home_page.play}
									/>
							</div>
						</div>
						<p className={`absolute bottom-15 text-[var(--white)] left-2`}>{lang.Home_page.Friend_online}</p>
					</div>
				</div>
			</Main>
		</div>
	);
}

export default Home