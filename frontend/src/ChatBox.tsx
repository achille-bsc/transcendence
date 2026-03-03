interface BoxProps {
	type?: string;
	id?:string;
	name?:string;
	className?: string;
	ariaLabel?: string;
}

export default function ChatBox ({type, id, name, className, ariaLabel} : BoxProps) {
	const computedAriaLabel = ariaLabel ?? name ?? id ?? "input";

	return (
		<div className="input-wrap-full">
			<input
				type={type}
					id={id}
					name={name}
					className={className}
					aria-label={computedAriaLabel}
					/>
		</div>
	)
}
