import MyButton from "./Button"

function Try () {
	return (
		<div>
			<MyButton onClick={() => alert("coucou t'es nul :)")}>
				<img src="../icons/github.png"/>
			</MyButton>
		</div>
	)
}

export default Try