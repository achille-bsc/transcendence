import MyButton from "./Button.tsx"
import Img from "./Img"
import {accept, reject} from "../../icons/Icons.tsx"
import { useLang } from "../script/langProvider.tsx";

interface FriendProps {
	children: string;
	userId?: number;
	onAccept?: (userId: number) => void;
	onReject?: (userId: number) => void;
}

export function Friend({ children, userId, onAccept, onReject }: FriendProps) {
	const lang = useLang().getLang();

	return (
		<li className="friend-item">
			<span className="friend-name">
				{children}
			</span>
			<div className="friend-actions">
				{onAccept && userId && (
					<MyButton onClick={() => onAccept(userId)}>
						<Img
							src={accept}
							alt={lang.Alt_text.friend_request_accept}
							className="friend-icon-accept"
						/>
					</MyButton>
				)}
				{onReject && userId && (
					<MyButton onClick={() => onReject(userId)}>
						<Img
							src={reject}
							alt={lang.Alt_text.friend_request_reject}
							className="friend-icon-reject"
						/>
					</MyButton>
				)}
			</div>
		</li>
	);
}
