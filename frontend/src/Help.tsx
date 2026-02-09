import en from "./language/en.json"
import fr from "./language/fr.json"
import { useState } from "react";

export default function choose_language() {
	const [speak, setSpeak] = useState(en)

	function ChangeLang(Lang) {
		console.log(Lang);
		if (Lang === "english") 
		{
			setSpeak(en);
			localStorage.setItem("language", JSON.stringify('en'));
		}
		if (Lang === "french")
		{
			setSpeak(fr);
			localStorage.setItem("language", JSON.stringify('fr'));
		}
		
	}
	return (
		<div className="justify-center">
			<button onClick={() => ChangeLang("english")}>
				anglais
			</button>
			<br />
			<button onClick={() => ChangeLang("french")}>
				français
			</button>
		</div>
	)
}