import RegisterButton from "./RegisterButton";
import { useLang } from "./script/langProvider";

export default function ChooseLanguage() {
	const { getLang, setLang } = useLang();
	
	return (
		<div className="justify-center">
			<RegisterButton
				label="Anglais"
				onClick={() => setLang("en")}
			/>
			<br/>
			<RegisterButton
				label="Français"
				onClick={() => setLang("fr")}
			/>
			<br/>
			<RegisterButton
				label="Deutsch"
				onClick={() => setLang("de")}
			/>
		</div>
	);
}