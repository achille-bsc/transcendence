import { useState } from "react";
import MyButton from "./utils/Button.tsx"
import Img from "./utils/Img.tsx"
import Main from "./utils/Main.tsx"

// friends left = 30%vw 
// profile = 70%vw

function Profile({ children = "username" }) {
  return (
	<>
		<Main/>
		<div className="ml-[35vw] w-[40vw] flex flex-col items-center space-y-4 p-6">
			<div className="text-purple-900 text-[20px] md:text-[30px] font-bold">
				<p>{children}</p>
			</div>
			<Img src="/src/img/img.webp" alt="User Profile Picture" className="w-[15vw] max-w-[200px] h-auto object-center rounded-full"/>
			<div className="flex flex-wrap justify-center gap-6 text-purple-900 text-[15px] md:text-[20px] font-bold">
				<div className="grid grid-cols-3 w-full items-center">
					<div className="justify-self-start">
						<MyButton>Invite</MyButton>
					</div>
					<div className="justify-self-center">
						<MyButton>Message</MyButton>
					</div>
					<div className="justify-self-end">
						<MyButton>Block</MyButton>
					</div>
				</div>
			</div>
		</div>  
		<div className="ml-[35vw] w-[40vw] flex flex-col space-y-4 mt-18 p-4">
			<div className="text-center text-purple-900 text-[20px] md:text-[30px] font-bold">
				<p>STATS</p>
			</div>
			<div className="p-4 text-purple-900 text-[15px] md:text-[20px] font-bold space-y-4">
				<p>Games played:</p>
				<p>Wins:</p>
				<p>Losses:</p>
				<p>Winrate:</p>
			</div>
		</div>
	</>
  );
}

export default Profile