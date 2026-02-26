interface InputProps {
	type?: string;
	id?:string;
	name?:string;
	value?: string;
	className?: string;
	placeholder?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	required:boolean;
	autoComplete?: string;
	onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function ChatInput ({type, id, name, value, className, placeholder, onChange, required, autoComplete, onKeyDown} : InputProps) {

	return (
		<div className="w-full">
			<input
				type={type}
				id={id}
				name={name}
				value={value}
				className={className}
				placeholder={placeholder}
				onChange={onChange}
				required={required}
				autoComplete={autoComplete}
				onKeyDown={onKeyDown}
				/>
		</div>
	)
}
