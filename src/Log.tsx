import './Log.css'

function Log () {

	return (
		<>
			<div class="flex min-h-screen justify-center items-center">
				<form action="URL" class="space-y-3 border px-25 p-21 bg-[#282828]">
					<label>
						<input type="text" class="border bg-[#3A3A3A] placeholder-[#9B9B9B]" placeholder="name" required/>
					</label><br />
					<div class="space-y-5">
						<label>
							<input type="password" class="border bg-[#3A3A3A] placeholder-[#9B9B9B]" placeholder="password" required/>
						</label><br />
						<div class="flex justify-center items-center">
							<input type="submit" value="Register" class=" p-2 px-5 border border-[#6E3CA3] bg-[#3A3A3A] text-[#9B9B9B]"/>
						</div>
					</div>
				</form>
			</div>
		</>
	)
}

export default Log