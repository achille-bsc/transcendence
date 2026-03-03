import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "../Button";
import { useLang } from "../script/langProvider";

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

function Sidebar({children})
{
	const lang = useLang().getLang();
    const [friends, setFriends] = useState([]);
    useEffect(() => {
        fetchFriends().then(data => {
            setFriends(data && data.friends);
        });
    }, [children]);
	const navigate = useNavigate();
	const openConversation = (pseudo) => {
		navigate(`/profile/${encodeURIComponent(pseudo)}`);
	}

    return (
        <div className="sidebar-root">
		    	{friends.map((friend) => (
	  				<MyButton key={friend.pseudo} className="sidebar-btn" onClick={() => openConversation(friend.pseudo)}>
			    	<div className="sidebar-item">
			        	<img
			        	    src="/src/img/img.webp"
			        	    alt={lang.Alt_text.profile_picture}
			        	    className="sidebar-avatar"
			        	/>
			        	<span>{friend.pseudo}</span>
			    	</div>
				</MyButton>
			))}
	    </div>
    )
}

export default Sidebar
