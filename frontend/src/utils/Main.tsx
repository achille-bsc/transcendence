import React from "react";
import MyButton from "./Button.tsx"
import Img from "./Img.tsx"
import { terms, user, friends, game, notifications, language} from "../../icons/Icons.tsx"
import SwitchButton from "./SwitchButton.tsx"
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Friend } from "./Friend.tsx";
import { useLang } from "../script/langProvider.tsx";
// import { useNavigate } from "react-router-dom";

// function DisplayMenu(){
// 	return
// }

// function fetchFriends() {
// 	return ([{name: "David" }, 
// 		{name: "EST" },
// 		{name: "OUAIS" }
// 	]);
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
// }

async function fetchPending(){
	const token = localStorage.getItem("token");
	if (localStorage.getItem("token")) {
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
			.filter((f: any) => f.requester)
			.map((f: any) => ({ id: f.requester.id, pseudo: f.requester.pseudo }));
			return pseudos;
		}
		else
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

async function isUser(username: string)
{
	const token = localStorage.getItem("token");
	if (!token)
	{
		console.error("Token not found");
		return false;
	}
	const res = await fetch('/api/db/profileother', {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body : JSON.stringify({ pseudo: username })
	});
	const data = await res.json();
	if (data?.user?.pseudo === username)
		return true;
	return false;
}

function Profile() {
	if (!localStorage.getItem("token"))
	{
		window.location.href = "/log";
		return ;
	}
	window.location.href = "/profile";
}

function Settings() {
	if (!localStorage.getItem("token"))
	{
		window.location.href = "/log";
		return ;
	}
	window.location.href = "/settings";
}

function Deconnexion() {
	localStorage.removeItem("token");
	window.location.href = "/log";
}

function SearchBar() {
	const lang = useLang().getLang();
	const [query, setQuery] = useState("");
	const [error, setError] = useState("");
	const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!query.trim())
		{
			setError("Cannot find user");
			return;
		}
		const exists = await isUser(query);
		if (!exists) {
			setError("Cannot find user");
			return;
		}
		setError("");
		window.location.href = `/profile/${query}`
	};
	return (
		<div>
			<form onSubmit={handleSubmit} aria-label="Search user form">
				<input
					aria-label="Search user"
					type="text"
					placeholder={lang.navbar.search}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="main-search-form-input"
				/>
				{error && <p className="main-search-error">{error}</p>}
			</form>
		</div>
	);
}

function Main({children = ""}: {children?: ReactNode}) {
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

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token)
			return;

		const protocol = window.location.protocol === "https:" ? "wss" : "ws";
		const ws = new WebSocket(
			`${protocol}://${window.location.host}/api/db/ws?token=${encodeURIComponent(token)}`
		);

		const intervalId = window.setInterval(() => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(JSON.stringify({ type: "ping" }));
			}
		}, 30000);

		return () => {
			window.clearInterval(intervalId);
			ws.close();
		};
	}, []);
	// const navigate = useNavigate();
	const [LanguagesClicked, setLanguages] = useState(false);
	const [TermsClicked, setTerms] = useState(false);
	const [openMenu, setOpenMenu] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState("friends");
	const { setLang } = useLang();
	const lang = useLang().getLang();
	const [pending, setPending] = useState<any[]>([]);

	const tabs = [
		{ key: "friends", label: lang.navbar.add },
		{ key: "pending", label: lang.navbar.pending },
		{ key: "blocked", label: lang.navbar.block }
	];

	useEffect(() => {
		fetchPending().then(result => setPending(result || []));
	}, []);

	const data: Record<string, any[]> = {
		friends: [],
		pending: pending,
		blocked: []
	};

	const [profile, setprofile] = useState(false);

	return (
		<div className="main-layout" >
			<div className="main-header">
				<div className="main-section-left">
					<MyButton onClick={() => setTerms(!TermsClicked)}>
							<Img src={terms} alt={lang.Alt_text.menu_icon} className="main-icon" />
						</MyButton>
						{TermsClicked &&
							<div className="main-menu-box">
								<div className="main-menu-list">
									<MyButton className="main-menu-btn main-menu-btn-bordered" onClick={() => window.location.href = "/terms"}>📃 Terms of Services</MyButton>
								</div>
							</div>
						}
					<div >
						<MyButton onClick={() => setOpenMenu(openMenu === "friends" ? null : "friends")}>
							<Img src={friends} alt={lang.Alt_text.friend_icon} className="main-icon" />
						</MyButton>
						{openMenu === "friends" && (
							<div className="main-friends-menu">
								<div className="main-tabs">
									{tabs.map((tab) => (
									<button
										key={tab.key}
										onClick={() => setActiveTab(tab.key)}
										className={`main-tab ${!isOn ? (activeTab === tab.key ? "main-tab-light-active" : "main-tab-light") : (activeTab === tab.key ? "main-tab-dark-active" : "main-tab-dark")}`}
									>
										{tab.label}
									</button>
									))}
								</div>
								<ul className="main-friends-list">
									{activeTab !== "friends" && (
										(data[activeTab]?.length ?? 0) > 0 
											? data[activeTab].map(({ id, pseudo }) => <Friend key={id}>{pseudo}</Friend>)
											: <li className="main-empty-item">No users found</li>
									)}
								</ul>
								<div className="main-search-wrap">
									<SearchBar/>
								</div>
							</div>
						)}
					</div>
					<SwitchButton checked={isOn} onChange={() => setIsOn(!isOn)} />
				</div>
				<span className="main-title">
					<div className="main-title-click" onClick={() => window.location.href = "/"}>
						Transcendence
					</div>
				</span>
				<div className="main-section-right">
					<MyButton onClick={() => window.location.href = "/game"}>
						<Img src={game} alt={lang.Alt_text.game_icon} className="main-icon"/>
					</MyButton>
					<div className="main-icon-wrap">
						<MyButton onClick={() => setLanguages(!LanguagesClicked)}>
							<Img src={language} alt={lang.Alt_text.language_icon} className="main-icon"/>
						</MyButton>
						{LanguagesClicked &&
							<div className="main-menu-box">
								<div className="main-menu-list">
									<MyButton className="main-menu-btn main-menu-btn-bordered" onClick={() => setLang("fr")}>🇫🇷 Français</MyButton>
									<MyButton className="main-menu-btn main-menu-btn-bordered" onClick={() => setLang("en")}>🇬🇧 English</MyButton>
									<MyButton className="main-menu-btn" onClick={() => setLang("de")}>🇩🇪 Deutsch</MyButton>
								</div>
							</div>
						}
					</div>
					<MyButton onClick={() => window.location.href = "/dm"}>
						<Img src={notifications} alt={lang.Alt_text.dm_icon} className="main-icon"/>
					</MyButton>
					<div className="main-icon-wrap">
						<MyButton onClick={() => setprofile(!profile)}>
							<Img src={user} alt={lang.Alt_text.profile_icon} className="main-icon"/>
						</MyButton>
						{profile &&
							<div className="main-menu-box main-menu-box-right">
								<div className="main-menu-list">
									<MyButton className="main-menu-btn main-menu-btn-bordered" onClick={() => Profile()}>{lang.navbar.profile}</MyButton>
									<MyButton className="main-menu-btn main-menu-btn-bordered" onClick={() => Settings()}>{lang.navbar.settings}</MyButton>
									<MyButton className="main-menu-btn" onClick={() => Deconnexion()}>{lang.navbar.deconnexion}</MyButton>
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
