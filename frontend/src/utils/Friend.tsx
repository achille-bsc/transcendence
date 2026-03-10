import MyButton from "./Button.tsx"
import Img from "./Img"
import {accept, reject} from "../../icons/Icons.tsx"
import { useLang } from "../script/langProvider.tsx";

async function rejectRequest(username: string){
	const token = localStorage.getItem("token");
	if (!token)
	{
		console.error("Token not found");
		return false;
	}
	const res = await fetch('/api/db/friend/refuse', {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body : JSON.stringify({ friendPseudo: username })
	});
	if (!res.ok)
		return alert("Error rejecting request");
	return alert("Request rejected")
}

async function acceptRequest(username: string){
	const token = localStorage.getItem("token");
	if (!token)
	{
		console.error("Token not found");
		return false;
	}
	const res = await fetch('/api/db/friend/accept', {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body : JSON.stringify({ friendPseudo: username })
	});
	if (!res.ok)
		return alert("Error accepting request");
	return alert("Request accepted")
}

export function Friend({ children }) {
	const lang = useLang().getLang();

	return (
		<li className="friend-item">
			<span className="friend-name">
				{children}
			</span>
			<div className="friend-actions">
				<MyButton onClick={() => acceptRequest(children)}>
					<Img
						src={accept}
						alt={lang.Alt_text.friend_request_accept}
						className="friend-icon-accept"
					/>
				</MyButton>
				<MyButton onClick={() => rejectRequest(children)}>
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
