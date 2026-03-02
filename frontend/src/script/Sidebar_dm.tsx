import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "../Button";
import { useLang } from "./langProvider";

async function fetchFriends()
{
	const token = localStorage.getItem("token");
	if (!token) {
 		console.error("Token not found");
 		return ;
	}
	try
	{
		const res = await fetch("/api/db/friend/list", {
		method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`,
			},
		});
		console.log("Res friendlist", res);
		if (!res.ok)
			alert("An error occured");
		const data = await res.json()
		console.log(data);
		return data;
	}
	catch (err)
	{
		console.log(err);
		return;
	}
}

interface InputProps {
	type?: string;
	id?:string;
	name?:string;
	value?: string;
	className?: string;
	placeholder?: string;
	onChange?: () => void | undefined;
	autoComplete?:string;
	required?:boolean;
}

export default function Sidebar_dm({className} : InputProps, {children})
{
	const lang = useLang().getLang();
	const [friends, setFriends] = useState([]);

	useEffect(() => {
		fetchFriends().then(data => {
			setFriends(data && data.friends);
		});
	}, []);
	const navigate = useNavigate();
	const openConversation = (id) => {
		navigate(`/conversation/${id}`);
	}

	return (
		<div className={className}>
			<div className="h-[calc(100vh-5rem)] overflow-y-auto border-r-2 border-b-0 border-solid">
				<div className="grid grid-cols-1 gap-6">
				{friends.map((friend) => (
					<MyButton key={friend.id} onClick={() => openConversation(friend.pseudo)}>
					<div className="grid grid-cols-1 p-3 border-b">
						<img
						src="/src/img/img.webp"
						alt={lang.Alt_text.profile_picture}
						className="w-[5rem] aspect-square rounded-full object-cover justify-self-center mb-2"
						/>
						<p>{friend.pseudo}</p>
					</div>
					</MyButton>
				))}
				</div>
			</div>
		</div>
	)
}