import MyButton from "./Button.tsx"
import Img from "./Img"
import {accept, reject} from "../../icons/Icons.tsx"
import "../index.css";
import "../Home.css";

function Jsp(){
	return alert("test")
}

function sendRequest(){
	return alert("Request sent")
}

export function Friend({ children }) {
  return (
	<li className="quantico-regular p-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
		<span className="text-[var(--default)] text-sm md:text-lg font-bold">
			{children}
		</span>
	  	<div className="flex items-center space-x-10">
			<MyButton onClick={() => sendRequest()}>
				<Img
					src={accept}
					alt="accept"
					className="w-5 h-5 md:w-6 md:h-6"
				/>
			</MyButton>
			<MyButton onClick={() => Jsp()}>
				<Img
					src={reject}
					alt="reject"
					className="w-4 h-4 md:w-5 md:h-5"
				/>
			</MyButton>
	  	</div>
	</li>
  );
}


export default Friend