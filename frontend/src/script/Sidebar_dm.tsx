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
		if (!res.ok)
			return "/src/img/img.webp";
		const data = await res.json();
		return data.avatarUrl || "/src/img/img.webp";
	}
	catch (err)
	{
		console.log(err);
		return "/src/img/img.webp";
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
		const res = await fetch("/user/userstatus", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({pseudo: pseudo}),
		});
		if (!res.ok)
			return false;
		const data = await res.json();
		return data.isOnline === true;
	}
	catch (err)
	{
		console.log(err);
		return false;
	}
}

interface SidebarDmProps {
	className?: string;
}

export default function Sidebar_dm({ className }: SidebarDmProps)
{
	const lang = useLang().getLang();
	const [friends, setFriends] = useState<Friend[]>([]);
	const [friendAvatars, setFriendAvatars] = useState<Record<string, string>>({});
	const [friendStatuses, setFriendStatuses] = useState<Record<string, boolean>>({});
	
	useEffect(() => {
		fetchFriends().then(data => {
			setFriends(data);
			if (data && data.length > 0) {
				const avatarPromises = data.map((friend: Friend) => 
					getOtherUserAvatar(friend.pseudo).then(avatar => ({
						pseudo: friend.pseudo,
						avatar: avatar
					}))
				);
				Promise.all(avatarPromises).then(avatars => {
					const avatarMap: Record<string, string> = {};
					avatars.forEach(({pseudo, avatar}) => {
						avatarMap[pseudo] = avatar;
					});
					setFriendAvatars(avatarMap);
				});

				const statusPromises = data.map((friend: Friend) =>
					getUserStatus(friend.pseudo).then(isOnline => ({
						pseudo: friend.pseudo,
						isOnline: isOnline
					}))
				);
				Promise.all(statusPromises).then(statuses => {
					const statusMap: Record<string, boolean> = {};
					statuses.forEach(({pseudo, isOnline}) => {
						statusMap[pseudo] = isOnline;
					});
					setFriendStatuses(statusMap);
				});
			}
		});
	}, []);
	
	const navigate = useNavigate();
	const openConversation = (pseudo: string) => {
		navigate(`/dm/${encodeURIComponent(pseudo)}`);
	}
	const rootClassName = className ? `dm-sidebar-root ${className}` : "dm-sidebar-root";

	return (
		<div className={rootClassName}>
			<div className="dm-sidebar-scroll">
				<div className="dm-sidebar-grid">
				{friends.map((friend) => (
					<MyButton key={friend.pseudo} className="dm-sidebar-btn" onClick={() => openConversation(friend.pseudo)}>
					<div className="dm-sidebar-item">
						<div className="dm-sidebar-avatar-wrap">
							<img
							src={friendAvatars[friend.pseudo] || "/src/img/img.webp"}
							alt={lang.Alt_text.profile_picture}
							className="dm-sidebar-avatar"
							/>
							<span className={`dm-sidebar-status-dot ${friendStatuses[friend.pseudo] ? "dm-sidebar-status-online" : "dm-sidebar-status-offline"}`}></span>
						</div>
						<p className="dm-sidebar-name">{friend.pseudo}</p>
					</div>
					</MyButton>
				))}
				</div>
			</div>
		</div>
	)
}
