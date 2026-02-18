import { useState } from "react";
import { useEffect } from "react";
<<<<<<< HEAD
=======
import { useNavigate } from "react-router-dom";
import MyButton from "../Button";
>>>>>>> 697a30a (Frontend:)

async function fetchFriends() {
	return [
		{
			id: 1,
			username: "Alice",
			picture: "/src/img/img.webp",
			author: "Alice",
			last_message: "Hey, how are you?"
		},
		{
			id: 2,
			username: "Bob",
			picture: "/src/img/img.webp",
			author: "You",
			last_message: "Let's play tonight!"
		},
		{
			id: 3,
			username: "Charlie",
			picture: "/src/img/img.webp",
			author: "You",
			last_message: "See you tomorrow 👋"
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

function Sidebar({children})
{
    const [friends, setFriends] = useState([]);
    useEffect(() => {
        fetchFriends(children).then(data => {
            setFriends(data);
        });
    }, [children]);
	const navigate = useNavigate();
	const openConversation = (id) => {
		navigate(`/conversation/${id}`);
	};
    return (
        <div className="w-[30vw] min-h-screen border-r-2 border-solid overflow-y-auto text-[#6E3CA3]">
	    	{friends.map((friend) => (
				<MyButton className="w-full" onClick={() => openConversation(12)}>
					<div key={friend.id} className="w-[30vw] p-3 border-b flex items-center gap-6 text-[#6E3CA3]">
	    				<img
	    					src={friend.picture}
	    					alt="friend"
	    					className="w-[5vw] aspect-square rounded-full"
	    				/>
	    				<p>{friend.author}: {friend.last_message}</p>
	    			</div>
				</MyButton>
	    	))}
	    </div>
    )
}

export default Sidebar