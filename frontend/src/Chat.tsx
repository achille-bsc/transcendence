function Chat () {
	async function keyPressFunction(event: any) { // See it with API
		if (event.key == 'Enter')
		{
			const input = document.getElementById("trucbidule") as HTMLInputElement;
			const msg = input.value;
			
			input.value = "";
			try {
				const response = await fetch('https://caddy:443/db/signin', {
					method: 'POST',
					headers: {
					'Content-Type': 'application/json'
					},
					body: JSON.stringify(msg)
				});

				if (!response.ok) {
					throw new Error('Something went wrong');
				}

				const result = await response.json();
				
				console.log(result);
			} catch (error) {

				console.error('Error:', error);
			}
			console.log(msg);
		};
	}

	return (
		<>
			<div className="bg-[#1E1E1E] min-h-screen flex items-end justify-center text-[#6E3CA3]">
				<label className="flex justify-center p-5">
					<input
						type="text"
						id="trucbidule"
						name="text"
						className="w-full border border-[#6E3CA3] p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B] text-[#969696]"
						placeholder="tape your text"
						required
						onKeyDown={keyPressFunction}
						/>
				</label>
			</div>
		</>
	)
}

export default Chat