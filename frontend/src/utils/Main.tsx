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

function fetchFriends() {
	return ([{name: "David" }, 
		{name: "EST" },
		{name: "OUAIS" }
	]);
	// try
	// {
	// 	const token = localStorage.getItem("token");
	// 	if (!token) {
	// 		console.error("Token not found");
	// 		return false;
	// 	}
	// 	console.log(token);
	// 	const res = await fetch('/api/db/profileuser', {
	// 		method: "POST",
	// 		headers: {
	// 			"Authorization": `Bearer ${token}`,
	// 		}
	// 	});
	// 	console.log(res);
	// 	if (!res.ok)
	// 	{
	// 		console.error("Server error:", res.status);
	// 		const text = await res.text();
	// 		console.error("Response body:", text);
	// 		return false;
	// 	}
	// 	console.log(res.status);
	// 	console.log(res.ok);
	// 	const data = await res.json();
	// 	console.log(data);
	// 	return data.user.pseudo;
	// }
	// catch (error)
	// {
	// 	console.error("Invalid token:", error);
	// 	return false;
	// }
}

async function fetchPending(){
	try
	{
		const token = localStorage.getItem("token");
		if (!token) {
			console.error("Token not found");
			return [];
		}
		const res = await fetch('/api/db/friend/receive', {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`,
			}
		});
		const data = await res.json();
		if (data.friends && data.friends.length > 0)
		{
    		const pseudos = data.friends
  			.filter(f => f.requester)
  			.map(f => ({ id: f.requester.id, pseudo: f.requester.pseudo }));
    		return pseudos;
    	}
		else
    	  return [];
	}
	catch (error)
	{
		console.error("Invalid token:", error);
		return [];
	}
// async function fetchFriends() {

// 	if (!localStorage.getItem("token"))
// 		return;
// 	const token = localStorage.getItem("token");
// 	const res = await fetch('/api/db/profileuser', {
// 		method: "POST",
// 		headers: {
// 			"Authorization": `Bearer ${token}` 
// 		}
// 	});
// 	const data = await res.json();
// 	return data.user.pseudo;
}

function isUser(username: string){
	if (username != "tigre")
		return false;
	return true;
}

function Profile() {
	if (!localStorage.getItem("token"))
	{
		window.location.href = "/log";
		return ;
	}
	window.location.href = "/profile";
}

function Deconnexion() {
	localStorage.removeItem("token");
	window.location.href = "/log";
}

function SearchBar() {
	const { getLang, setLang } = useLang();
	const lang = useLang().getLang();
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
	 	 	    	placeholder={lang.navbar.search}
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
		return savedTheme === "dark";
	});
	useEffect(() => {
		const nextTheme = isOn ? "dark" : "light";
		localStorage.setItem("darkMode", nextTheme);
		document.documentElement.classList.remove("light", "dark");
		document.documentElement.classList.add(nextTheme);
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

	const [profile, setprofile] = useState(false);

	return (
		<div className={`relative h-dvh overflow-hidden bg-[var(--background)] text-[var(--default)]`} >
			<div className={`min-h-20 border-b-2 border-solid flex items-center justify-between px-2 md:px-10 relative bg-[var(--background-header)]`}>
				<div className="flex items-center space-x-4">
					<MyButton onClick={() => window.location.href = "/chat"}>
						<Img src={menu} alt={lang.Alt_text.menu_icon} className="w-8 md:w-10 h-auto" />
					</MyButton>
					<div >
						<MyButton onClick={() => setOpenMenu(openMenu === "friends" ? null : "friends")}>
							<Img src={friends} alt={lang.Alt_text.friend_icon} className="w-8 md:w-10 h-auto" />
						</MyButton>
						{openMenu === "friends" && (
							<div className={`absolute top-full w-70 text-[var(--default)] bg-[var(--background-box-select)]`}>
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
									{data[activeTab] && data[activeTab].length > 0 ? (
										data[activeTab].map(({ id, pseudo }) => (
											<Friend key={id}>{pseudo}</Friend>))
									) : (<li className="items-center text-[var(--default)]"> No friends found</li> )}
								</ul>
								<div className="flex justify-center p-2">
									<SearchBar/>
									<input
										type="text"
										placeholder={lang.navbar.search}
										className={`focus:outline-hidden border-1 border-solid border-[var(--default)] text-[var(--props)] text-sm p-2 bg-[var(--background-box)]`}
									/>
								</div>
							</div>
						)}
					</div>
					<SwitchButton checked={isOn} onChange={() => setIsOn(!isOn)} />
				</div>
				<span className="quantico-regular text-[var(--default)] text-[25px] md:text-[50px] font-bold">
					<div className="cursor-pointer" onClick={() => window.location.href = "/"}>
						Transcendence
					</div>
				</span>
				<div className="flex items-center space-x-4 items-start">
					<MyButton onClick={() => window.location.href = "/game"}>
						<Img src={game} alt={lang.Alt_text.game_icon} className="w-8 md:w-10 h-auto"/>
					</MyButton>
					<div className="w-8 md:w-10 h-auto">
						<MyButton onClick={() => setLanguages(!LanguagesClicked)}>
							<Img src={language} alt={lang.Alt_text.language_icon} className="w-8 md:w-10 h-auto"/>
						</MyButton>
						{LanguagesClicked &&
							<div className={`absolute top-full border-2 border-solid bg-[var(--background-box-select)]`}>
								<div className="grid grid-rows text-[var(--default)] text-[15px] md:text-[15px]">
									<MyButton className="cursor-pointer p-1 px-3 border-b-1 text-[var(--contrast)] border-[var(--default)] hover:bg-[var(--props)]" onClick={() => setLang("fr")}>🇫🇷 Français</MyButton>
									<MyButton className="cursor-pointer p-1 px-3 border-b-1 text-[var(--contrast)] border-[var(--default)] hover:bg-[var(--props)]" onClick={() => setLang("en")}>🇬🇧 English</MyButton>
									<MyButton className="cursor-pointer p-1 px-3 text-[var(--contrast)] border-[var(--default)] hover:bg-[var(--props)]" onClick={() => setLang("de")}>🇩🇪 Deutsch</MyButton>
								</div>
							</div>
						}
					</div>
					<MyButton onClick={() => window.location.href = "/dm"}>
						<Img src={notifications} alt={lang.Alt_text.dm_icon} className="w-8 md:w-10 h-auto"/>
					</MyButton>
					<div className="w-8 md:w-10 h-auto">
						<MyButton onClick={() => setprofile(!profile)}>
							<Img src={user} alt={lang.Alt_text.profile_icon} className="w-8 md:w-10 h-auto"/>
						</MyButton>
						{profile &&
							<div className={`absolute top-full border-2 border-solid bg-[var(--background-box-select)] right-0`}>
								<div className="grid grid-rows text-[var(--default)] text-[15px] md:text-[15px]">
									<MyButton className="cursor-pointer p-1 px-3 border-b-1 text-[var(--contrast)] border-[var(--default)] hover:bg-[var(--props)]" onClick={() => Profile()}>{lang.navbar.profile}</MyButton>
									<MyButton className="cursor-pointer p-1 px-3 text-[var(--contrast)] border-[var(--default)] hover:bg-[var(--props)]" onClick={() => Deconnexion()}>{lang.navbar.deconnexion}</MyButton>
								</div>
							</div>
						}
					</div>
				</div>
			</div>
			{children}
		</div>
	)
}

export default Main
//essayer getelembyid pour inclure la page dans main sinon ff ca marche
