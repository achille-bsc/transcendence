import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "../Button";
import { useLang } from "../script/langProvider";

interface Friend {
	pseudo: string;
}

interface FriendsResponse {
	friends: Friend[];
}

interface SidebarProps {
	children?: string | null;
}

// async function fetchFriends() {
// 	return [
// 		{
// 			id: 1,
// 			username: "Alice",
// 			picture: "/src/img/img.webp",
// 			author: "Alice",
// 			last_message: "Hey, how are you?"
// 		},
// 		{
// 			id: 2,
// 			username: "Bob",
// 			picture: "/src/img/img.webp",
// 			author: "You",
// 			last_message: "Let's play tonight!"
// 		},
// 		{
// 			id: 3,
// 			username: "Charlie",
// 			picture: "/src/img/img.webp",
// 			author: "You",
// 			last_message: "See you tomorrow 👋"
// 		},
		
// 	];
//}

async function fetchFriends(): Promise<FriendsResponse | undefined>
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
		if (!res.ok)
			alert("An error occured");
		const data = await res.json()
		return data;
	}
	catch (err)
	{
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

async function getUserAvatar() {
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

function Sidebar({children}: SidebarProps)
{
	const lang = useLang().getLang();
	const [friends, setFriends] = useState<Friend[]>([]);
	const [friendAvatars, setFriendAvatars] = useState<Record<string, string>>({});
	const [friendStatuses, setFriendStatuses] = useState<Record<string, boolean>>({});
    const [userAvatar, setUserAvatar] = useState("/src/img/img.webp");
    const [userIsOnline, setUserIsOnline] = useState(false);
    useEffect(() => {
        getUserAvatar().then(avatar => {
            setUserAvatar(avatar);
        });
    }, []);
    useEffect(() => {
		if (typeof children !== "string" || children.trim() === "")
			return;
		getUserStatus(children).then((isOnline) => {
			setUserIsOnline(isOnline);
		});
	}, [children]);
    useEffect(() => {
        fetchFriends().then(data => {
            setFriends((data && data.friends) || []);
            if (data && data.friends) {
                const avatarPromises = data.friends.map((friend: Friend) => 
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

				const statusPromises = data.friends.map((friend: Friend) =>
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
    }, [children]);
	const navigate = useNavigate();
	const openConversation = (pseudo: string) => {
		navigate(`/profile/${encodeURIComponent(pseudo)}`);
	}

    return (
        <div className="sidebar-root">
				{children && (
					<MyButton className="sidebar-btn" onClick={() => navigate('/profile')}>
						<div className="sidebar-item">
							<div className="sidebar-avatar-wrap">
								<img
									src={userAvatar}
									alt={lang.Alt_text.profile_picture}
									className="sidebar-avatar"
								/>
								<span className={`sidebar-status-dot ${userIsOnline ? "sidebar-status-online" : "sidebar-status-offline"}`}></span>
							</div>
							<span className="sidebar-name">{children} (You)</span>
						</div>
					</MyButton>
				)}
		    	{friends.map((friend) => (
	  				<MyButton key={friend.pseudo} className="sidebar-btn" onClick={() => openConversation(friend.pseudo)}>
			    	<div className="sidebar-item">
						<div className="sidebar-avatar-wrap">
			        		<img
			        	    	src={friendAvatars[friend.pseudo] || "/src/img/img.webp"}
			        	    	alt={lang.Alt_text.profile_picture}
			        	    	className="sidebar-avatar"
			        		/>
			        		<span className={`sidebar-status-dot ${friendStatuses[friend.pseudo] ? "sidebar-status-online" : "sidebar-status-offline"}`}></span>
						</div>
				        	<span className="sidebar-name">{friend.pseudo}</span>
			    	</div>
				</MyButton>
			))}
	    </div>
    )
}

export default Sidebar
