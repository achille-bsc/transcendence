import MyButton from "./Button.tsx"
import Img from "./Img"
import {accept, reject} from "../../icons/Icons.tsx"

export function Friend({ children }) {
  return (
	<li className=" bg-gray-400 rounded p-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
		<span className="text-purple-900 text-sm md:text-lg font-bold">
			{children}
		</span>
	  	<div className="flex items-center space-x-3">
			<MyButton>
				<Img
					src={reject}
					alt="reject"
					className="w-4 h-4 md:w-5 md:h-5"
				/>
			</MyButton>
			<MyButton>
				<Img
					src={accept}
					alt="accept"
					className="w-4 h-4 md:w-5 md:h-5"
				/>
			</MyButton>
	  	</div>

	</li>
  );
}


export default Friend