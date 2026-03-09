import MyButton from "./Button.tsx"
import Img from "./Img"
import {accept, reject} from "../../icons/Icons.tsx"
import { useLang } from "../script/langProvider.tsx";

function Jsp(){
	return alert("test")
}

function sendRequest(){
	return alert("Request sent")
}

export function Friend({ children }) {
	const lang = useLang().getLang();

	return (
		<li className="friend-item">
			<span className="friend-name">
				{children}
			</span>
			<div className="friend-actions">
				<MyButton onClick={() => sendRequest()}>
					<Img
						src={accept}
						alt={lang.Alt_text.friend_request_accept}
						className="friend-icon-accept"
					/>
				</MyButton>
				<MyButton onClick={() => Jsp()}>
					<Img
						src={reject}
						alt={lang.Alt_text.friend_request_reject}
						className="friend-icon-reject"
					/>
				</MyButton>
			</div>
		</li>
	);
}
