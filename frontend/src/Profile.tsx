import MyButton from "./utils/Button.tsx"
import Img from "./utils/Img.tsx"
import Main from "./utils/Main.tsx"
import Sidebar from "./utils/Sidebar.tsx"
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLang } from "./script/langProvider.tsx";
import "./styles/index.css";

async function getUsername()
{
	try
	{
		const token = localStorage.getItem("token");
		if (!token) {
			console.error("Token not found");
			return false;
		}
		const res = await fetch('/api/db/profileuser', {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}` 
			}
		});
		const data = await res.json();
		return data.user.pseudo;
	}
	catch (error)
	{
		console.error("Invalid token:", error);
		return false;
	}
}

async function ProfilePicture() {
	const token = localStorage.getItem("token");
	try
	{
		const res = await fetch("/api/db/useravatar", {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			}
		});
		console.log("RESS", res);
		if (!res.ok)
			alert("An error occured");
		const data = await res.json();
		
		console.log(data);
		return data.avatarUrl;
	}
	catch (err)
	{
		alert("ERROR");
		console.log(err);
		return;
	}
}

async function getOtherUserAvatar(pseudo: string) {
	const token = localStorage.getItem("token");
	try
	{
		const res = await fetch("/api/db/avatarother", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({pseudo: pseudo})
		});
		console.log("RESS", res);
		if (!res.ok)
			return "/default-avatar.png";
		const data = await res.json();
		
		console.log(data);
		return data.avatarUrl || "/default-avatar.png";
	}
	catch (err)
	{
		console.log(err);
		return "/default-avatar.png";
	}
}

async function checkIfFriend(friendPseudo: string)
{
	const token = localStorage.getItem("token");
	if (!token) {
 		console.error("Token not found");
 		return false;
	}
	try
	{
		const res = await fetch("/api/db/friend/list", {
		method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`,
			},
		});
		if (!res.ok)
			return false;
		const data = await res.json()
		console.log("Friend list data:", data);
		if (!data.friends || !Array.isArray(data.friends))
			return false;
		return data.friends.some((friend: any) => friend.pseudo === friendPseudo);
	}
	catch (err)
	{
		console.log(err);
		return false;
	}
}

async function getUserStatus(pseudo: string)
{
	const token = localStorage.getItem("token");
	if (!token) {
 		console.error("Token not found");
 		return false;
	}
	try
	{
		const res = await fetch("/api/db/userstatus", {
		method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({pseudo: pseudo}),
		});
		if (!res.ok)
			return false;
		const data = await res.json()
		return data.isOnline === true;
	}
	catch (err)
	{
		console.log(err);
		return false;
	}
}

export default function Profile() {
	const token = localStorage.getItem("token");
	if (!token) {
		window.location.href = "/log";
		return null;
	}
	const lang = useLang().getLang();
	const navigate = useNavigate();
	const { username } = useParams();
	const [loggedUser, setLoggedUser] = useState<string | null>(null);
	const [profilePicture, setProfilePicture] = useState<string>("");
	const [isFriend, setIsFriend] = useState<boolean>(false);
	const [isOnline, setIsOnline] = useState<boolean>(false);
	const profileToDisplay = username || loggedUser;
	const isOwnProfile = !username || username === loggedUser;
	
	useEffect(() => {
		async function fetchUsername() {
			const name = await getUsername();
			setLoggedUser(name);
		}
		fetchUsername();
	}, []);

	useEffect(() => {
		async function fetchProfilePicture() {
			let avatarUrl;
			if (isOwnProfile) {
				avatarUrl = await ProfilePicture();
			} else if (username) {
				avatarUrl = await getOtherUserAvatar(username);
			}
			setProfilePicture(avatarUrl);
		}
		fetchProfilePicture();
	}, [username, isOwnProfile]);

	useEffect(() => {
		if (username && !isOwnProfile) {
			checkIfFriend(username).then(result => {
				setIsFriend(result);
			});
		}
	}, [username, isOwnProfile]);

	useEffect(() => {
		if (!profileToDisplay)
			return;
		getUserStatus(profileToDisplay).then(result => {
			setIsOnline(result);
		});
	}, [profileToDisplay]);

	async function sendRequest()
	{
		if (isOwnProfile)
		{
			alert("YOU CANNOT ADD YOURSELF");
			return;
		}
		const token = localStorage.getItem("token");
		if (!token) {
	 		console.error("Token not found");
	 		return ;
		}
		try
		{
			const res = await fetch("/api/db/friend/send", {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({friendPseudo : username}),
			});
			console.log("RESS", res);
			if (!res.ok)
				alert("An error occured");
			const data = await res.json()
			console.log(data);
			alert("Friend request sent!");
			setIsFriend(true);
		}
		catch (err)
		{
			alert("ERROR");
			console.log(err);
			return;
		}
	}

	async function removeFriend()
	{
		if (isOwnProfile)
		{
			alert("YOU CANNOT REMOVE YOURSELF");
			return;
		}
		const token = localStorage.getItem("token");
		if (!token) {
	 		console.error("Token not found");
	 		return ;
		}
		try
		{
			const res = await fetch("/api/db/friend/remove", {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({friendPseudo : username}),
			});
			console.log("RESS", res);
			if (!res.ok)
				alert("An error occured");
			const data = await res.json()
			console.log(data);
			alert("Friend removed!");
			setIsFriend(false);
		}
		catch (err)
		{
			alert("ERROR");
			console.log(err);
			return;
		}
	}

	return (
		<Main> 
			<div className="flex flex-row h-[calc(100dvh-5rem)] quantico-regular">
				<div className="w-20 sm:w-44 md:w-56 overflow-hidden h-full shrink-0">
					<Sidebar>{loggedUser}</Sidebar>
				</div>
				<div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center text-[var(--contrast)]">
					<div className="my-auto bg-[var(--background-box-select)] p-5 md:p-8 w-full md:min-w-[400px] max-w-[500px]">
						<div className="flex flex-col items-center gap-6">
							<div className="flex flex-col items-center gap-4">
								<Img 
									src={profilePicture || "/default-avatar.png"} 
									alt={lang.Alt_text.profile_picture} 
									className={`ring-2 ring-offset-4 ring-offset-[var(--background-box-select)] w-[120px] h-[120px] rounded-full object-cover object-center ${isOnline ? "ring-green-500" : "ring-red-500"}`}
								/>
							</div>
							
							<h2 className="text-2xl font-bold break-words text-center max-w-full px-2">{profileToDisplay}</h2>

							<div className="w-full bg-[var(--background-box)] p-4">
								<div className="border border-b-0 border-[var(--props)] px-2 py-1 flex flex-col text-[15px]">
									<div className="text-[10px]">
										<p>{lang.Profile_page.pseudo}</p>
									</div>
								<div className="py-1 break-words">
										{profileToDisplay}
									</div>
								</div>
								<div className="border border-t-0 border-[var(--props)] px-2 py-1 flex flex-col text-[15px]">
									<div className="text-[10px]">
										<p>{lang.Profile_page.member_since}</p>
									</div>
									<div className="py-1">
										January 2026
									</div>
								</div>
							</div>

							{!isOwnProfile && (
								<div className="flex gap-3 flex-wrap justify-center w-full">
									<MyButton 
										className="bg-[var(--background-box)] hover:bg-[var(--button)] px-4 py-2"
										onClick={() => navigate(`/dm/${username}`)}
									>
										{lang.Profile_page.message}
									</MyButton>
									<MyButton 
										className="bg-[var(--background-box)] hover:bg-[var(--button)] px-4 py-2"
										onClick={() => isFriend ? removeFriend() : sendRequest()}
									>
										{isFriend ? lang.Profile_page.remove_friend : lang.Profile_page.add_friend}
									</MyButton>
								</div>
							)}

							{isOwnProfile && (
								<MyButton 
									className="bg-[var(--background-box)] hover:bg-[var(--button)] px-6 py-2 w-full"
									onClick={() => navigate('/settings')}
								>
									{lang.Profile_page.edit_profile}
								</MyButton>
							)}
						</div>
					</div>
				</div>
			</div>
		</Main>
	);
}
