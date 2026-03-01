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
		<button className={className ? className : "w-full sm:w-auto p-2 px-5 text-sm sm:text-base bg-[var(--background-box)] hover:[background-[var(--button)]] focus:outline-2 text-[var(--contrast)]"} onClick={onClick} >
			<div>{icon == "github" ? <img className="cursor-pointer hover:[background-[var(--button)]]" src="../icons/github.png" alt="logo github pour connexion"/> : "" }</div>
			<div>{icon == "send" ? <img className="cursor-pointer" src="../icons/send.png" alt="logo send pour envoyer le message"/> : "" }</div>
			{label}
		</button>
	)
}