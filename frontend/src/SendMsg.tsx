import { verifToken } from "./script/utils";

export default function SendMsg(msg: string) {
	if (msg.trim() === '') {
		return null;
	}
	return (
		<div className="sendmsg-bubble">
			{msg}
		</div>
	)
}
