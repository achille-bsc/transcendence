import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "../Button";
import { useLang } from "./langProvider";

async function fetchFriends() {
	return [
		{
			id: 1,
			username: "Alice",
			picture: "/src/img/img.webp",
			author: "Alice",
			last_message: "Hey, how are you?"
		},
	];
}

// async function fetchFriends(username)
// {
// 	try
// 	{
// 		const response = await fetch('https://caddy:443/db/friends', {
// 			method: 'POST',
// 			body: JSON.stringify(username)
// 		});
// 		if (!response.ok)
// 			throw new Error('Something went wrong');
// 		const data = await response.json();
// 		return data;
// 	}
// 	catch (error)
// 	{
// 		console.error('Error:', error);
// 		return [];
// 	}
	
// }

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
	const [friends, setFriends] = useState<{ id: number; username: string; picture: string; author: string; last_message: string; }[]>([]);
	useEffect(() => {
		fetchFriends().then(data => {
			setFriends(data);
		});
	}, []);
	const navigate = useNavigate();
	const openConversation = (id) => {
		navigate(`/conversation/${id}`);
	}

	return (
		<div className={className}>
			<div className="h-[calc(100vh-5rem)]  overflow-y-auto border-r-2 border-b-0 border-solid">
				<div className="grid grid-cols-1 gap-6">
				{friends.map((friend) => (
					<MyButton key={friend.id} onClick={() => openConversation(friend.id)}>
					<div className="grid grid-cols-1 p-3 border-b">
						<img
						src={friend.picture}
						alt={lang.Alt_text.profile_picture}
						className="w-[5rem] aspect-square rounded-full object-cover justify-self-center mb-2"
						/>
						<p>{friend.username}</p>
					</div>
					</MyButton>
				))}
				</div>
			</div>
		</div>
	)
}