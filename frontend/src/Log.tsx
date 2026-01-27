function Log () {

	return (
		<>
			<div className="bg-[#1E1E1E] min-h-screen flex items-center justify-center text-[#6E3CA3]">
				<form 
				  action="URL"
				  className="bg-[#282828] w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%]">
					<div className="flex">
						<div className="w-1/2 text-center p-4 sm:p-5 cursor-pointer">Login</div>
						<a className="w-1/2 text-center p-4 sm:p-5 bg-[#202020] cursor-pointer" href="register"><div >Register</div></a>
					</div>
					<div className="p-4 sm:p-5 md:p-6">
						<label className="flex justify-center"><br />
							<input
								type="text"
								id="name"
								name="name"
								className="w-full border p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B]"
							placeholder="name or email"
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
							<a href="/"><input
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

export default Log