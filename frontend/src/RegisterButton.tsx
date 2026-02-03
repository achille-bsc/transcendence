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
		<button className={className} onClick={onClick} >
			<div>{icon == "github" ? <img className="cursor-pointer" src="../icons/github.png" alt="logo github pour connexion"/> : "" }</div>
			{label}
		</button>
	)
}