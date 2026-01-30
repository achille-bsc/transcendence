import '../node_modules/tailwindcss/index.css';
// import { verifToken } from './script/utils';

async function Home () {
	
	// if (!(await verifToken(localStorage.getItem('token'))))
	// {
	// 	window.location.href = "/";
	// }

	return (
		<div className="bg-[#1E1E1E] text-[#6E3CA3]">
			<div className="min-h-screen flex items-center justify-center">
				<div className="w-1/2 text-center p-4 sm:p-5">
					The Game's name1 <br />
					<div className="flex justify-center items-center">
						<a href="/"><input
							type="submit"
							value="Register"
							className="w-full sm:w-auto p-2 px-5 text-sm sm:text-base bg-linear-[90deg,#6E3CA3,#A82828] focus:outline-2 text-[#FFFFFF]"
							/></a>
					</div>
				</div>
				<div className="w-1/2 text-center p-4 sm:p-5">
					The Game's name2 <br />
					<div className="flex justify-center items-center">
						<a href="/"><input
							type="submit"
							value="Register"
							className="w-full sm:w-auto p-2 px-5 text-sm sm:text-base bg-linear-[90deg,#6E3CA3,#A82828] focus:outline-2 text-[#FFFFFF]"
							/></a>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home