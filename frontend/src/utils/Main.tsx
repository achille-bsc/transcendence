import MyButton from "./Button.tsx"
import Img from "./Img.tsx"
import { menu, user, friends, game, notifications, language} from "../../icons/Icons.tsx"
import SwitchButton from "./SwitchButton.tsx"
import { useState, useEffect } from "react";
import { Friend } from "./Friend.tsx";
import { useLang } from "../script/langProvider.tsx";
import { useNavigate } from "react-router-dom";

function DisplayMenu(){
	return
}

async function fetchFriends() {
	try
	{
		const token = localStorage.getItem("token");
		if (!token) {
			console.error("Token not found");
			return false;
		}
		console.log("CHEEEEEEEEEEEEEEEEEEEEF", token);
		const res = await fetch('/api/db/profileuser', {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}` 
			}
		});
		console.log("TESSSSSSST", res);
		const data = await res.json();
		console.log("TEST", data.user.pseudo);
		return data.user.pseudo;
	}
	catch (error)
	{
		console.error("Invalid token:", error);
		return false;
	}
}

function fetchPending(){
	return ([{name: "David" }]);
}

function isUser(username: string){
	console.log(username);
	if (username != "tigre")
		return false;
	return true;
}

function SearchBar() {
	const [query, setQuery] = useState("");
	const [error, setError] = useState("");
	const handleSubmit = (e) => {
  		e.preventDefault();
  		if (!query.trim() || !isUser(query))
		{
    		setError("Cannot find user");
    		return;
    	}
    	setError("");
  		window.location.href = `/profile/${query}`
  	};
	return (
		<>
	 	 	<form onSubmit={handleSubmit}>
	 	 	  	<input
	 	 	    	type="text"
	 	 	    	placeholder="Search user..."
	 	 	    	value={query}
	 	 	    	onChange={(e) => setQuery(e.target.value)}
	 	 	    	className="border p-2 rounded"
				/>
				{error && <p className="text-center text-red-500">{error}</p>}
	 	 	</form>
		</>
	);
}

function Main({children = ""}) {
	const [isOn, setIsOn] = useState(() => {
		const savedTheme = localStorage.getItem("darkMode");
		return savedTheme === "true";
	});
	useEffect(() => {
		localStorage.setItem("darkMode", isOn);
	}, [isOn]);
	const navigate = useNavigate();
	const [LanguagesClicked, setLanguages] = useState(false);
	const [openMenu, setOpenMenu] = useState(null);
	const [activeTab, setActiveTab] = useState("friends");
	const { getLang, setLang } = useLang();
	const lang = useLang().getLang();

	const tabs = [
		{ key: "friends", label: lang.navbar.add },
		{ key: "pending", label: lang.navbar.pending },
		{ key: "blocked", label: lang.navbar.block }
	];
	const data = {
		friends: fetchFriends(),
		pending: fetchPending(),
		blocked: []
	};
	return (
		<>
			<div className={`relative h-dvh overflow-hidden transition-colors duration-300 ${!isOn ? "bg-white text-[#6E3CA3]" : "bg-[#1A1A1A] text-[#6E3CA3]"}`} >
    			<div className={`min-h-20 border-b-2 border-solid flex items-center justify-between px-2 md:px-10 relative ${!isOn ? "bg-[#EFE0FF] text-[#6E3CA3]" : "bg-[#141414] text-[#6E3CA3]"}`}>
    				<div className="flex items-center space-x-4">
        				<MyButton onClick={() => window.location.href = "/chat"}>
        					<Img src={menu} alt="Menu" className="w-8 md:w-10 h-auto" />
        				</MyButton>
        				<div >
        					<MyButton onClick={() => setOpenMenu(openMenu === "friends" ? null : "friends")}>
        						<Img src={friends} alt="Friends" className="w-8 md:w-10 h-auto" />
        					</MyButton>
        					{openMenu === "friends" && (
        						<div className={`absolute top-full w-70 text-[var(--violet-default)] ${!isOn ? "bg-[#E5CDFF]" : "bg-[#282828]"}`}>
        							<div className="grid grid-cols-3 mb-3">
        								{tabs.map((tab) => (
        					        	<button
        					        		key={tab.key}
        					        		onClick={() => setActiveTab(tab.key)}
        					        		className={`px-2 py-1 ${!isOn ? (activeTab === tab.key ? "bg-[#E5CDFF]" : "bg-[#F0E2FF] hover:text-white") : (activeTab === tab.key ? "bg-[#282828]" : "bg-[#202020] hover:text-white")}`}
        					        	>
        					          		{tab.label}
        					        	</button>
        					    		))}
        							</div>
        							<ul className="space-y-2 mb-3">
										{data[activeTab]?.map(({name}) => (
											<Friend>{name}</Friend>
										))}
									</ul>
									<div className="flex justify-center p-2">
  										<SearchBar/>
  										<input
  											type="text"
  											placeholder={lang.navbar.search}
  											className={`focus:outline-hidden border-1 border-solid border-[var(--violet-default)] text-[#969696] text-sm p-2 ${!isOn ? "bg-[#EFE0FF]" : "bg-[#2D2D2D]"}`}
  										/>
  									</div>
        						</div>
        					)}
        				</div>
						<SwitchButton checked={isOn} onChange={() => setIsOn(!isOn)} />
					</div>
					<span className="quantico-regular text-[#6E3CA3] text-[25px] md:text-[50px] font-bold">
						<div className="cursor-pointer" onClick={() => window.location.href = "/"}>
							Transcendence
						</div>
					</span>
					<div className="flex items-center space-x-4 items-start">
						<MyButton onClick={() => window.location.href = "/game"}>
							<Img src={game} alt="Game" className="w-8 md:w-10 h-auto"/>
						</MyButton>
						<div className="w-8 md:w-10 h-auto">
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
						<MyButton onClick={() => window.location.href = "/dm"}>
							<Img src={notifications} alt="Notifications" className="w-8 md:w-10 h-auto"/>
						</MyButton>
						<MyButton onClick={() => window.location.href = "/profile"}>
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
//essayer getelembyid pour inclure la page dans main sinon ff ca marche