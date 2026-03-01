import { verifToken } from "./script/utils";

export default function SendMsg(msg: string) {
	if (msg.trim() === '') {
		return null;
	}
	console.log(msg);
	return (
		<div className="bg-[var(--background-box)] text-[var(--contrast)] p-2 rounded-lg mb-2 w-full">
			{msg}
		</div>
	)
}