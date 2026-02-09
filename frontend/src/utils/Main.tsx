import Profile from "../Profile.tsx"
import MyButton from "./Button.tsx"
import Img from "./Img.tsx"
import { menu, user, friends, game, notifications } from "../../icons/Icons.tsx"
import SwitchButton from "./SwitchButton.tsx"
import { useState } from "react";
import { Friend } from "./Friend.tsx"

function SwitchLights(){
	return alert("test")
}

function DisplayMenu(){
	return
}

function Main (){
	const [isOn, setIsOn] = useState(false);
	const [showFriends, setShowFriends] = useState(false);
	return (
		<>
			<div className={` relative min-h-screen transition-colors duration-300 ${!isOn ? "bg-white text-black" : "bg-gray-800 text-white"}`} >
				<div className="h-20 bg-black flex items-center justify-between px-2 md:px-10">
					<div className="flex items-center space-x-4">
						<MyButton onClick={() => DisplayMenu()}>
							<Img src={menu} alt="Menu" className="w-[2vw] h-[4vw]" />
						</MyButton>
						<div className = "relative">
							<MyButton onClick={() => setShowFriends(!showFriends)}>
								<Img src={friends} alt="Friends" className="w-[2vw] h-[4vw]"/>
							</MyButton>
							{showFriends && (
								<div className="absolute top-full mt-2 w-[20vw] bg-black text-white p-4 ">
									<input
				    					type="text"
				    					placeholder="Search someone..."
				    					className="w-full p-2 text-white"
				   					/>
				    				<ul className="space-y-1">
				    					<Friend>Alice</Friend>
				    					<Friend>Bob</Friend>
										{/* Improve this to search real users and link icons to functions */}
				    				</ul>
							  	</div>
							)}
						</div>
						<div
    					  className={`min-h-screen transition-colors duration-300 ${
    					    isOn ? "bg-purple-900 text-white" : "bg-black text-white"
    					  }`}
    					/>
						<SwitchButton  checked={isOn} onChange={() => setIsOn(!isOn)} />
					</div>
					<span className="text-purple-900 text-[30px] md:text-[50px] font-bold">
						Transcendence
					</span>
					<div className="flex items-center space-x-4">
						<MyButton onClick={() => DisplayMenu()}>
							<Img src={game} alt="Game" className="w-[2vw] h-[4vw]"/>
						</MyButton>
						<MyButton onClick={() => DisplayMenu()}>
							<Img src={notifications} alt="Notifications" className="w-[2vw] h-[4vw]"/>
						</MyButton>
						<MyButton onClick={() => Profile()}>
							<Img src={user} alt="User" className="w-[2vw] h-[4vw]"/>
						</MyButton>
					</div>
				</div>
			</div>
		</>
	)
}

export default Main