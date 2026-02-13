import MyButton from "./utils/Button.tsx"
import Img from "./utils/Img.tsx"
import Main from "./utils/Main.tsx"

// friends left = 30%vw 
// profile = 70%vw

function Profile({ children = "username" }) {
	return (
		<Main> 
			<div className="flex">
				<div className="w-[30vw] min-h-screen border-r-2 border-solid text-[#6E3CA3]">
					<p className=" text-[15px] md:text-[20px] font-bold p-4">Sidebar</p>
				</div>
				<div className="flex-1 flex flex-col items-center">
					<div className="w-[40vw] flex flex-col items-center space-y-4 p-6">
						<div className="text-[#6E3CA3] text-[20px] md:text-[30px] font-bold">
							<p>{children}</p>
						</div>
						<Img src="/src/img/img.webp" alt="User Profile Picture" className="w-[15vw] max-w-[200px] rounded-full"/>	
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
						<div className="text-center text-[#6E3CA3] text-[20px] md:text-[30px] font-bold">
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