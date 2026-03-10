import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "../Button";
import { useLang } from "./langProvider";

interface Friend {
	pseudo: string;
}

async function fetchFriends(): Promise<Friend[]> {
	const token = localStorage.getItem("token");
	if (!token) {
		return [];
	}

	const response = await fetch("/user/friend", {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		return [];
	}

	const data = await response.json();
	if (!data.success || !Array.isArray(data.friends)) {
		return [];
	}
	return data.friends
		.map((friend: any) => {
			const pseudo =
				friend?.pseudo ??
				friend?.username ??
				friend?.requester?.pseudo ??
				friend?.addressee?.pseudo ??
				"";
			return { pseudo };
		})
		.filter((friend: Friend) => friend.pseudo.trim() !== "");
}

interface BottombarProps {
	className?: string;
}

export default function Bottombar({ className }: BottombarProps)
{
	const lang = useLang().getLang();
	const [friends, setFriends] = useState<Friend[]>([]);
	useEffect(() => {
		fetchFriends().then(data => {
			setFriends(data);
		});
	}, []);
	const navigate = useNavigate();
	const openConversation = (pseudo: string) => {
		navigate(`/profile/${encodeURIComponent(pseudo)}`);
	}

	return (
		<div className={className}>
			<div className="dm-bottombar-scroll">
				<div className="dm-bottombar-grid">
				{friends.map((friend) => (
					<MyButton key={friend.pseudo} onClick={() => openConversation(friend.pseudo)}>
					<div className="dm-bottombar-item">
						<img
						src="/src/img/img.webp"
						alt={lang.Alt_text.profile_picture}
						className="dm-bottombar-avatar"
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
