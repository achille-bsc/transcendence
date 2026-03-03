import MyButton from "./utils/Button.tsx"
import Img from "./utils/Img.tsx"
import Main from "./utils/Main.tsx"
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

export default function Settings() {
	const token = localStorage.getItem("token");
	if (!token) {
		window.location.href = "/log";
		return null;
	}
	const lang = useLang().getLang();
	const { username } = useParams();
	const [loggedUser, setLoggedUser] = useState(null);
	useEffect(() => {
		async function fetchUsername() {
			const name = await getUsername();
			setLoggedUser(name);
		}
		fetchUsername();
	}, []);
	const profileToDisplay = username || loggedUser;
	
	return (
		<Main> 
			<div className="profile-layout quantico-regular">
				<div className="profile-main">
					<div className="profile-card">
						<div className="profile-avatar-wrap">
							<Img src="" alt={lang.Alt_text.profile_picture} className="settings-avatar"/>	
						</div>
						<div className="profile-username">
							<p>{profileToDisplay}</p>
						</div>
						<div>
							<MyButton></MyButton>
						</div>
					</div>	
				</div>
			</div>
		</Main>
	);
}
