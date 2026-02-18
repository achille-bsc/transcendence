import { useState } from "react";

interface ButtonProps {
	label?: string;
	icon?: string;
	className?: string;
	onClick?: () => void;
	autoComplete?:string;
}

export default function RegisterButton ({label, icon, className, onClick} : ButtonProps) {

	return (
		<button className={className ? className : "w-full sm:w-auto p-2 px-5 text-sm sm:text-base bg-[#3A3A3A] hover:bg-linear-[90deg,#6E3CA3,#A82828] focus:outline-2 text-[#FFFFFF]"} onClick={onClick} >
			<div>{icon == "github" ? <img className="cursor-pointer" src="../icons/github.png" alt="logo github pour connexion"/> : "" }</div>
			<div>{icon == "send" ? <img className="cursor-pointer" src="../icons/send.png" alt="logo send pour envoyer le message"/> : "" }</div>
			{label}
		</button>
	)
}