interface InputProps {
	type?: string;
	id?:string;
	name?:string;
	className?: string;
	placeholder?: string;
	onChange?: () => void;
	required:boolean;
	autoComplete?: string;
	onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function ChatInput ({type, id, name, className, placeholder, onChange, required, autoComplete, onKeyDown} : InputProps) {

	return (
		<div className="w-full">
			<input
				type={type}
				id={id}
				name={name}
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