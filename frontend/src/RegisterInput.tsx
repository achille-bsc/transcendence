interface InputProps {
	type?: string;
	id?:string;
	name?:string;
	value?: string;
	className?: string;
	placeholder?: string;
	onChange?: () => void | undefined;
	autoComplete?:string;
	required?:boolean;
	ariaLabel?: string;
}

export default function RegisterInput ({value, type, id, name, className, placeholder, onChange, autoComplete, required, ariaLabel} : InputProps) {
	const computedAriaLabel = ariaLabel ?? placeholder ?? name ?? id ?? "input";

	return (
		<div className="input-wrap-full">
			{placeholder}
			<input
				type={type}
				id={id}
				name={name}
				value={value}
					className={className}
					placeholder={placeholder}
					aria-label={computedAriaLabel}
					onChange={onChange}
					autoComplete={autoComplete}
					required={required}
				/>
		</div>
	)
}
