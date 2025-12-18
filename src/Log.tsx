import './Log.css'

function Log () {

	return (
		<>
			<div>
				<form action="URL">
					<label htmlFor="">
						<input type="text" class="border m-[15px]" placeholder="name" required/>
					</label><br />
					<label htmlFor="">
						<input type="password" class="border m-[15px]" placeholder="password" required/>
					</label><br />
					<input type="submit" value="tkt fait confiance" class="border"/>
				</form>
			</div>
		</>
	)
}

export default Log