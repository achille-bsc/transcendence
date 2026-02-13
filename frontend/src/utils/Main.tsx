import MyButton from "./Button.tsx"
import Img from "./Img.tsx"
import { menu, user, friends, game, notifications } from "../../icons/Icons.tsx"
import SwitchButton from "./SwitchButton.tsx"
import { useState } from "react";
import { Friend } from "./Friend.tsx"

function SwitchLanguage(){
	return alert("test")
}

function DisplayMenu(){
	return
}

function Main({children = ""}) {
	const [isOn, setIsOn] = useState(false);
	const [LanguagesClicked, setLanguages] = useState(false);
	const [openMenu, setOpenMenu] = useState(null);
	const [activeTab, setActiveTab] = useState("add");
	return (
		<>
			<div className={` relative min-h-screen transition-colors duration-300 ${!isOn ? "bg-white text-black" : "bg-black text-white"}`} >
    			<div className="min-h-20 bg-black flex items-center justify-between px-2 md:px-10 relative">
    				<div className="flex items-center space-x-4">
        				<MyButton onClick={() => DisplayMenu()}>
        					<Img src={menu} alt="Menu" className="w-8 md:w-10 h-auto" />
        				</MyButton>
        				<div className="relative">
        			  		<MyButton onClick={() => setOpenMenu(openMenu === "friends" ? null : "friends")}>
        			    		<Img src={friends} alt="Friends" className="w-8 md:w-10 h-auto" />
        					</MyButton>
        					{openMenu === "friends" && (
        						<div className="absolute top-full w-[20vw] bg-black text-white p-4">
        							<div className="grid grid-cols-3 mb-3">
        								{["add", "demand", "blocked"].map((tab) => (
        					        	<button
        					        		key={tab}
        					        		onClick={() => setActiveTab(tab)}
        					        		className={`px-2 py-1 rounded transition ${activeTab === tab ? "bg-zinc-700" : "text-zinc-400 hover:text-white"}`}
        					        	>
        					          		{tab.charAt(0).toUpperCase() + tab.slice(1)}
        					        	</button>
        					    		))}
        							</div>
        							<ul className="space-y-2 mb-3">
        								<Friend>Alice</Friend>
					    				<Friend>Bob</Friend>
        							</ul>
        							<input
        							  type="text"
        							  placeholder="Search someone..."
        							  className="w-full bg-zinc-800 text-sm p-2"
        							/>
        						</div>
        					)}
        				</div>
						<SwitchButton  checked={isOn} onChange={() => setIsOn(!isOn)} />
					</div>
					<span className="text-purple-900 text-[25px] md:text-[50px] font-bold">
						Transcendence
					</span>
					<div className="flex items-center space-x-4">
						<MyButton onClick={() => DisplayMenu()}>
							<Img src={game} alt="Game" className="w-8 md:w-10 h-auto"/>
						</MyButton>
						<div className="relative shrink-0">
							<MyButton onClick={() => setLanguages(!LanguagesClicked)}>
								<Img src={notifications} alt="Language ??" className="w-8 md:w-10 h-auto"/>
							</MyButton>
							{LanguagesClicked &&
								<div className="absolute top-full w-20 h-auto bg-black">
									<div className="grid grid-rows text-purple-900 text-[15px] md:text-[15px]">
										<MyButton onClick={() => SwitchLanguage}>Francais</MyButton>
										<MyButton onClick={() => SwitchLanguage}>English</MyButton>
										<MyButton onClick={() => SwitchLanguage}>Francais</MyButton>
									</div>
								</div>
							}
						</div>
						<MyButton onClick={() => DisplayMenu()}>
							<Img src={notifications} alt="Notifications" className="w-8 md:w-10 h-auto"/>
						</MyButton>
						<MyButton onClick={() => DisplayMenu()}>
							<Img src={user} alt="User" className="w-8 md:w-10 h-auto"/>
						</MyButton>
					</div>
				</div>
				{children}
			</div>
		</>
	)
}

export default Main
//essayer getelembyid pour inclure la page dnas main sinon ff ca marche