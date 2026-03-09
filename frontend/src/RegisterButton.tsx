import { useState } from "react";
import { useLang } from "./script/langProvider";

interface ButtonProps {
	label?: string;
	icon?: string;
	className?: string;
	onClick?: () => void;
	autoComplete?:string;
	disabled?: boolean;
}

export default function RegisterButton ({label, icon, className, onClick, disabled = false} : ButtonProps) {
	const lang = useLang().getLang();

	return (
		<button
			className={className ? className : "register-btn-default"}
			onClick={onClick}
			disabled={disabled}
		>
			<div>{icon == "github" ? <img className="register-btn-icon-github" src="../icons/github.png" alt={lang.Alt_text.github_logo}/> : "" }</div>
			<div>{icon == "send" ? <img className="register-btn-icon-send" src="../icons/send.png" alt={lang.Alt_text.send_logo}/> : "" }</div>
			{label}
		</button>
	)
}
