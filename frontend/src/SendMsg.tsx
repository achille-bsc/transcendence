import { verifToken } from "./script/utils";

export default function SendMsg(msg: string) {
	if (msg.trim() === '') {
		return null;
	}
	console.log(msg);
	return (
		<div className="bg-[#3A3A3A] text-[#ffffff] p-2 rounded-lg mb-2 w-full">
			{msg}
		</div>
	)
}