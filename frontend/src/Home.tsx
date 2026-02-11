import '../node_modules/tailwindcss/index.css';
import Button from "./TryButton.tsx";
import Help from "./Help.tsx";
import en from "./language/en.json";
import fr from "./language/fr.json";
import { useState } from "react";
import choose_language from './Help.tsx';
import { useLang } from './script/langProvider.tsx';
// import { verifToken } from './script/utils';

function Home () {
	// if (!(await verifToken(localStorage.getItem('token'))))
	// {
	// 	window.location.href = "/";
	// }
	const lang = useLang().getLang()
	return (
		<div className="bg-[#1E1E1E] text-[#6E3CA3]">
			<Help/>
			<div className="min-h-screen flex items-center justify-center">
				<div className="w-1/2 text-center p-4 sm:p-5">
					Kong
					<div className="flex justify-center items-center">
						<Button
							className="cursor-pointer w-full sm:w-auto p-2 px-5 text-sm sm:text-base bg-linear-[90deg,#6E3CA3,#A82828] focus:outline-2 text-[#FFFFFF]"
							onClick={() => "game page"}
							label={lang.navigation.game}
							/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home