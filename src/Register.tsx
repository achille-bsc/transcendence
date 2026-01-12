function Register () {
	
	return (
		<>
			<div className="bg-[#1E1E1E] min-h-screen flex items-center justify-center">
				<form 
				  action="URL" 
				  className="bg-[#282828] w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%]">
					<div className="flex">
						<a className="w-1/2 text-center p-4 sm:p-5 bg-[#202020] cursor-pointe" href="log"><div >Login</div></a>
						<div className="w-1/2 text-center p-4 sm:p-5 cursor-pointer">Register</div>
					</div>
					<div className="p-4 sm:p-5 md:p-6">
						<label className="flex justify-center"><br />
							<input
								type="text"
								id="name"
								name="name"
								className="w-full border p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B]"
								placeholder="name"
								required
								/>
						</label><br />
						<label className="flex justify-center">
							<input
								type="password"
								id="password"
								name="password"
								className="w-full border p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B]"
								placeholder="password"
								required
								/>
						</label><br />
						<div className="flex justify-center items-center">
							<a href="Home.tsx"><input
								type="submit"
								value="Register"
								className="w-full sm:w-auto p-2 px-5 text-sm sm:text-base bg-[#3A3A3A] hover:bg-linear-[90deg,#6E3CA3,#A82828] focus:outline-2 text-[#FFFFFF]"
								/></a>
						</div>
					</div>
				</form>
			</div>
		</>
	)
}

export default Register