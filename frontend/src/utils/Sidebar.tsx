import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "../Button";

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
    const [friends, setFriends] = useState([]);
    useEffect(() => {
        fetchFriends().then(data => {
            setFriends(data && data.friends);
        });
    }, [children]);
	const navigate = useNavigate();
	const openConversation = (id) => {
		navigate(`/conversation/${id}`);
	}

    return (
        <div className="w-[30vw] min-h-screen border-r-2 border-solid overflow-y-auto text-[var(--default)]">
	    	{friends.map((friend) => (
  				<MyButton key={friend.id} className="w-full" onClick={() => openConversation(friend.id)}>
			    	<div className="w-[30vw] p-3 border-b flex items-center gap-6 text-[var(--default)]">
			        	<img
			        	    src="/src/img/img.webp"
			        	    alt={friend.pseudo}
			        	    className="w-[5vw] aspect-square rounded-full"
			        	/>
			        	<span>{friend.pseudo}</span>
			    	</div>
				</MyButton>
			))}
	    </div>
    )
}

export default Sidebar