import MyButton from "./Button.tsx"
import Img from "./Img.tsx"
import { menu, user, friends, game, notifications, language} from "../../icons/Icons.tsx"
import SwitchButton from "./SwitchButton.tsx"
import { useState } from "react";
import { Friend } from "./Friend.tsx";
import { useLang } from "../script/langProvider.tsx";

function DisplayMenu(){
	return
}

function Main({children = ""}) {
	const [isOn, setIsOn] = useState(false);
	const [LanguagesClicked, setLanguages] = useState(false);
	const [openMenu, setOpenMenu] = useState(null);
	const [activeTab, setActiveTab] = useState("add");
	const { getLang, setLang } = useLang();
	const lang = useLang().getLang();

	return (
		// <>
			<div className={`quantico-regular relative min-h-screen transition-colors duration-300 ${!isOn ? "bg-white text-[#6E3CA3]" : "bg-[#1A1A1A] text-[#6E3CA3]"}`} >
    			<div className={`min-h-20 border-b-1 border-solid flex items-center justify-between px-2 md:px-10 relative ${!isOn ? "bg-[#EFE0FF] text-[#6E3CA3]" : "bg-[#141414] text-[#6E3CA3]"}`}>
    				<div className="flex items-center space-x-4">
        				<MyButton onClick={() => DisplayMenu()}>
        					<Img src={menu} alt="Menu" className="w-8 md:w-10 h-auto" />
        				</MyButton>
        				<div >
        					<MyButton onClick={() => setOpenMenu(openMenu === "friends" ? null : "friends")}>
        						<Img src={friends} alt="Friends" className="w-8 md:w-10 h-auto" />
        					</MyButton>
        					{openMenu === "friends" && (
        						<div className={`absolute top-full w-70 text-[var(--violet-default)] ${!isOn ? "bg-[#E5CDFF]" : "bg-[#282828]"}`}>
        							<div className="grid grid-cols-3 mb-3">
        								{["add", "demand", "blocked"].map((tab) => (
        								<button
        									key={tab}
        									onClick={() => setActiveTab(tab)}
        									className={`px-2 py-1 transition ${!isOn ? (activeTab === tab ? "bg-[#E5CDFF]" : "bg-[#F0E2FF] hover:text-white") : (activeTab === tab ? "bg-[#282828]" : "bg-[#202020] hover:text-white")}`}
        									>
        									{tab.charAt(0).toUpperCase() + tab.slice(1)}
        								</button>
        								))}
        							</div>
        							<ul className="space-y-2 mb-3">
        								<Friend>Alice</Friend>
										<Friend>Bob</Friend>
        							</ul>
									<div className="flex justify-center p-2">
  										<input
  											type="text"
  											placeholder={lang.navbar.search}
  											className={`border-1 border-solid border-[var(--violet-default)] text-[#969696] text-sm p-2 ${!isOn ? "bg-[#EFE0FF]" : "bg-[#2D2D2D]"}`}
  										/>
  									</div>
        						</div>
        					)}
        				</div>
						<SwitchButton checked={isOn} onChange={() => setIsOn(!isOn)} />
					</div>
					<span className="quantico-regular text-[#6E3CA3] text-[25px] md:text-[50px] font-bold">
						Transcendence
					</span>
					<div className="flex items-center space-x-4">
						<MyButton onClick={() => DisplayMenu()}>
							<Img src={game} alt="Game" className="w-8 md:w-10 h-auto"/>
						</MyButton>
						<div className="w-8 md:w-10">
							<MyButton onClick={() => setLanguages(!LanguagesClicked)}>
								<Img src={language} alt="Language ??" className="w-8 md:w-10 h-auto"/>
							</MyButton>
							{LanguagesClicked &&
								<div className={`absolute top-full w-20 h-auto border-2 border-solid ${!isOn ? "bg-[#E5CDFF]" : "bg-[#282828]"}`}>
									<div className="grid grid-rows text-[#6E3CA3] text-[15px] md:text-[15px]">
										<MyButton onClick={() => setLang("fr")}>Français</MyButton>
										<MyButton onClick={() => setLang("en")}>English</MyButton>
										<MyButton onClick={() => setLang("de")}>Deutsch</MyButton>
									</div>
								</div>
							}
						</div>
						<MyButton onClick={() => DisplayMenu()}>
							<Img src={notifications} alt="Notifications" className="w-8 md:w-10 h-auto"/>
						</MyButton>
						<MyButton onClick={() => window.location.href = "/profile"}>
							<Img src={user} alt="User" className="w-8 md:w-10 h-auto"/>
						</MyButton>
					</div>
				</div>
				{children}
			</div>
		// </>
	)
}

export default Main
//essayer getelembyid pour inclure la page dans main sinon ff ca marche