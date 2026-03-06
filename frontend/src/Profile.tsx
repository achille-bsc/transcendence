import MyButton from "./utils/Button.tsx"
import Img from "./utils/Img.tsx"
import Main from "./utils/Main.tsx"
import Sidebar from "./utils/Sidebar.tsx"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLang } from "./script/langProvider.tsx";

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

export default function Profile() {
	const token = localStorage.getItem("token");
	if (!token) {
		window.location.href = "/log";
		return null;
	}
	const lang = useLang().getLang();
	const { username } = useParams();
	const [loggedUser, setLoggedUser] = useState(null);
	const [newProfilePicture, setNewProfilePicture] = useState(null);
	useEffect(() => {
		async function fetchUsername() {
			const name = await getUsername();
			setLoggedUser(name);
		}
		fetchUsername();
	}, []);
	const profileToDisplay = username || loggedUser;

	useEffect(() => {
			async function fetchProfilePicture() {
				const avatarUrl = await ProfilePicture();
				setNewProfilePicture(avatarUrl);
			}
			fetchProfilePicture();
		}, []);

	async function sendRequest()
	{
		if (!username)
		{
			alert("YOU CANNOT ADD YOURSELF");
			return;
		}
		const token = localStorage.getItem("token");
		console.log(token);
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
			<div className="profile-layout quantico-regular">
				<Sidebar>{loggedUser}</Sidebar>
				<div className="profile-main">
					<div className="profile-card">
						<div className="profile-avatar-wrap">
							<Img src={newProfilePicture || "/default-avatar.png"} alt={lang.Alt_text.profile_picture} className="ring ring-[var(--default)] profile-avatar ring-2 ring-offset-4 ring-offset-[var(--background-box)]"/>	
						</div>
						<div className="profile-username">
							<p>{profileToDisplay}</p>
						</div>
						<div className="profile-actions">
							<div className="profile-action-start">
								<MyButton>Invite</MyButton>
							</div>
							<div className="profile-action-center">
								<MyButton onClick={() => window.location.href = `/dm/${username}`}>Message</MyButton>
							</div>
							<div className="profile-action-start">
								<MyButton onClick={() => sendRequest()}>Ajout</MyButton>
							</div>
							<div className="profile-action-end">
								<MyButton>Block</MyButton>
							</div>
						</div>
					</div>	
				</div>
			</div>
		</Main>
	);
}
