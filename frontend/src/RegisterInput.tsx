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
}

export default function RegisterInput ({value, type, id, name, className, placeholder, onChange, autoComplete, required} : InputProps) {

	return (
		<div className="w-full">
			{placeholder}
			<input
				type={type}
				id={id}
				name={name}
				value={value}
				className={className}
				placeholder={placeholder}
				onChange={onChange}
				autoComplete={autoComplete}
				required={required}
				/>
		</div>
	)
}