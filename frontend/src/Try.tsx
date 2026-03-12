import MyButton from "./Button"
import { useLang } from "./script/langProvider";

function Try () {
	const lang = useLang().getLang();

	return (
		<div>
			<MyButton onClick={() => alert(lang.Feedback.generic_error_occurred)}>
				<img src="../icons/github.png"/>
			</MyButton>
		</div>
	)
}

export default Try