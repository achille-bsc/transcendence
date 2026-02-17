import MyButton from "./utils/Button.tsx"
import Img from "./utils/Img.tsx"
import Main from "./utils/Main.tsx"
import { useState } from "react";
import { useEffect } from "react";

// friends left = 30%vw 
// profile = 70%vw

async function fetchFriends(username) {
	return [
		{
			id: 1,
			username: "Alice",
			picture: "/src/img/img.webp",
			last_message: "Hey, how are you?"
		},
		{
			id: 2,
			username: "Bob",
			picture: "/src/img/img.webp",
			last_message: "Let's play tonight!"
		},
		{
			id: 3,
			username: "Charlie",
			picture: "/src/img/img.webp",
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

function Profile({ children = "username" }) {
	const [friends, setFriends] = useState([]);

	useEffect(() => {
		fetchFriends(children).then(data => {
			setFriends(data);
		});
	}, [children]);
	return (
		<Main> 
			<div className="flex">
				<div className="w-[30vw] min-h-screen border-r-2 border-solid overflow-y-auto text-[#6E3CA3]">
					{friends.map((friend) => (
						<div key={friend.id} className="p-3 border-b grid grid-cols-3 w-full gap-6 text-[#6E3CA3]">
							<img
								src={friend.picture}
								alt="friend"
								className="w-10 h-10 rounded-full"
							/>
							<p>{friend.last_message}</p>
						</div>
					))}
				</div>
				<div className="flex-1 flex flex-col items-center">
					<div className="w-[40vw] flex flex-col items-center space-y-4 p-6">
						<div className="text-[#6E3CA3] text-[20px] md:text-[30px] font-bold">
							<p>{children}</p>
						</div>
						<div className="border-b-2 border-solid p-6">
							<Img src="/src/img/img.webp" alt="User Profile Picture" className="w-[15vw] aspect-square rounded-full"/>	
						</div>
						<div className="grid grid-cols-3 w-full gap-6 text-[#6E3CA3] text-[10px] md:text-[25px] font-bold">
							<div className="justify-self-start">
								<MyButton>Invite</MyButton>
							</div>
							<div className="justify-self-center">
								<MyButton>Message</MyButton>
							</div>
							<div className="justify-self-end">
								<MyButton>Block</MyButton>
							</div>
						</div>
					</div>	
					<div className="w-[40vw] flex flex-col space-y-4 mt-10 p-4">
						<div className="border-b-2 border-solid text-center text-[#6E3CA3] text-[20px] md:text-[30px] font-bold">
							<p>STATS</p>
						</div>
						<div className="p-4 text-[#6E3CA3] text-[15px] md:text-[20px] font-bold space-y-4">
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