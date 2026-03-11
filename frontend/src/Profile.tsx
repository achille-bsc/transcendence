import MyButton from "./utils/Button.tsx"
import Img from "./utils/Img.tsx"
import Main from "./utils/Main.tsx"
import Sidebar from "./utils/Sidebar.tsx"
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLang } from "./script/langProvider.tsx";
import "./styles/index.css";
import { verifToken } from "./script/utils.ts";

async function getUsername()
{
	try
	{
		const token = localStorage.getItem("token");
		if (!token) {
			console.log("Token not found");
			return false;
		}
		if (!verifToken(token))
		{
			localStorage.removeItem("token");
			window.location.href = "/log";
		}
		const res = await fetch('/user/profile', {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}` 
			}
		});
		const data = await res.json();
		if (data.success === false || !data.user)
			return false;
		return { pseudo: data.user.pseudo, createdAt: data.user.createdAt };
	}
	catch (error)
	{
		console.log("Invalid token:", error);
		return false;
	}
}

async function ProfilePicture() {
	const token = localStorage.getItem("token");
	try
	{
		const res = await fetch("/user/useravatar", {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
			}
		});
		const data = await res.json();
		if (data.success === false)
			return "/default-avatar.png";
		return data.avatarUrl || "/default-avatar.png";
	}
	catch (err)
	{
		console.log("Error fetching profile picture:", err);
		return "/default-avatar.png";
	}
}

async function getOtherUserAvatar(pseudo: string) {
	const token = localStorage.getItem("token");
	try
	{
		const res = await fetch("/user/avatarother", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({pseudo: pseudo})
		});
		const data = await res.json();
		if (data.success === false)
			return "/default-avatar.png";
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
 		console.log("Token not found");
 		return false;
	}
	try
	{
		const res = await fetch("/user/friend", {
		method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
			},
		});
		const data = await res.json();
		if (data.success === false || !data.friends || !Array.isArray(data.friends))
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
 		console.log("Token not found");
 		return false;
	}
	try
	{
		const res = await fetch("/user/userstatus", {
		method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({pseudo: pseudo}),
		});
		const data = await res.json();
		if (data.success === false)
			return false;
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
	if (!verifToken(token))
	{
		localStorage.removeItem("token");
		window.location.href = "/log";
		return null;
	}
	const lang = useLang().getLang();
	const navigate = useNavigate();
	const { username } = useParams();
	const [loggedUser, setLoggedUser] = useState<string | null>(null);
	const [createdAt, setCreatedAt] = useState<string | null>(null);
	const [profilePicture, setProfilePicture] = useState<string>("");
	const [isFriend, setIsFriend] = useState<boolean>(false);
	const [isOnline, setIsOnline] = useState<boolean>(false);
	const profileToDisplay = username || loggedUser;
	const isOwnProfile = !username || username === loggedUser;
	const [isUserValid, setIsUserValid] = useState(false);

	useEffect(() => {
		async function fetchUsername() {
			const name = await getUsername();
			if (!name) {
				localStorage.removeItem("token");
				window.location.href = "/log";
				return;
			}
			setLoggedUser(name.pseudo);
			setCreatedAt(name.createdAt);
		}
		fetchUsername();
	}, []);

	useEffect(() => {
		async function UsernameValidation() {
			try {
				const name = await fetch("/user/profileother", {
					method: "POST",
					headers: {
						"Authorization": `Bearer ${token}`,
						"Content-Type": "application/json"
					},
					body: JSON.stringify({pseudo: username})
				});
				const data = await name.json();
				if (data.success === false || !data.user || !data.user.pseudo) {
					window.location.href = "/profile";
					return;
				}
				setIsUserValid(true);
			} catch (err) {
				console.log("Username validation error:", err);
				window.location.href = "/profile";
			}
		}
		if (username)
			UsernameValidation();
		else
			setIsUserValid(true);
	});

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
				alert(lang.Feedback.cannot_add_yourself);
			return;
		}
		const token = localStorage.getItem("token");
		if (!token) {
	 		console.log("Token not found");
	 		return ;
		}
		try
		{
			const res = await fetch("/user/send", {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({friendPseudo : username}),
			});
			const data = await res.json();
			if (data.success === false) {
				alert(data.error || lang.Feedback.generic_error_occurred);
				return;
			}
			setIsFriend(true);
		}
		catch (err)
		{
				alert(lang.Feedback.generic_error);
			console.log(err);
			return;
		}
	}

	async function removeFriend()
	{
		if (isOwnProfile)
		{
				alert(lang.Feedback.cannot_remove_yourself);
			return;
		}
		const token = localStorage.getItem("token");
		if (!token) {
	 		console.log("Token not found");
	 		return ;
		}
		try
		{
			const res = await fetch("/user/remove", {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({friendPseudo : username}),
			});
			const data = await res.json();
			if (data.success === false) {
				alert(data.error || lang.Feedback.generic_error_occurred);
				return;
			}
			alert(lang.Feedback.friend_removed);
			setIsFriend(false);
		}
		catch (err)
		{
			alert(lang.Feedback.generic_error);
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
										{createdAt?.slice(0, 10)}
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
