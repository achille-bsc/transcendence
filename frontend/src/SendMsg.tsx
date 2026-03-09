import { verifToken } from "./script/utils";

export default function SendMsg(msg: string) {
	if (msg.trim() === '') {
		return null;
	}
	console.log(msg);
	return (
		<div className="sendmsg-bubble">
			{msg}
		</div>
	)
}
