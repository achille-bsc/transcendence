import MyButton from "./utils/Button.tsx"
import Img from "./utils/Img.tsx"
import Main from "./utils/Main.tsx"
import Sidebar from "./utils/Sidebar.tsx"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./index.css";
import "./Home.css";

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

function Profile() {
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
			<div className="flex quantico-regular">
				<Sidebar>{loggedUser}</Sidebar>
				<div className="flex-1 flex flex-col items-center">
					<div className="w-[40vw] flex flex-col items-center space-y-4 p-6">
						<div className="text-[var(--default)] text-[20px] md:text-[30px]">
							<p>{profileToDisplay}</p>
						</div>
						<div className="border-b-2 border-solid p-6">
							<Img src="/src/img/img.webp" alt="User Profile Picture" className="w-[15vw] aspect-square rounded-full object-cover"/>	
						</div>
						<div className="grid grid-cols-3 w-full gap-6 text-[var(--default)] text-[10px] md:text-[25px]">
							<div className="justify-self-start">
								<MyButton>Invite</MyButton>
							</div>
							<div className="justify-self-center">
								<MyButton>Message</MyButton>
							</div>
							<div className="justify-self-start">
								<MyButton onClick={() => sendRequest()}>Ajout</MyButton>
							</div>
							<div className="justify-self-end">
								<MyButton>Block</MyButton>
							</div>
						</div>
					</div>	
					<div className="w-[40vw] flex flex-col space-y-4 mt-10 p-4">
						<div className="border-b-2 border-solid text-center text-[var(--default)] text-[20px] md:text-[30px]">
							<p>STATS</p>
						</div>
						<div className="p-4 text-[var(--default)] text-[15px] md:text-[20px] space-y-4">
							<p>Games played:</p>
							<p>Wins:</p>
							<p>Losses:</p>
							<p>Winrate:</p>
						</div>
					</div>	
				</div>
			</div>
		</Main>
	);
}

export default Profile