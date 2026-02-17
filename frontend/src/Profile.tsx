import MyButton from "./utils/Button.tsx"
import Img from "./utils/Img.tsx"
import Main from "./utils/Main.tsx"
import Sidebar from "./utils/Sidebar.tsx"

// friends left = 30%vw 
// profile = 70%vw

function Profile({ children = "username" }) {
	
	return (
		<Main> 
			<div className="flex">
				<Sidebar>{children}</Sidebar>
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