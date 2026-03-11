import { useLang } from "./script/langProvider";

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
	disabled?: boolean;
	ariaLabel?: string;
	maxLength?: number;
}

export default function ChatInput ({type, id, name, value, className, placeholder, onChange, required, autoComplete, onKeyDown, disabled = false, ariaLabel, maxLength} : InputProps) {
	const lang = useLang().getLang();
	const computedAriaLabel = ariaLabel ?? placeholder ?? name ?? id ?? lang.Feedback.chat_input_aria;

	return (
		<div className="input-wrap-full">
			<input
				type={type}
				id={id}
				name={name}
				value={value}
				className={className}
				placeholder={placeholder}
				onChange={onChange}
				aria-label={computedAriaLabel}
						required={required}
						autoComplete={autoComplete}
						onKeyDown={onKeyDown}
						maxLength={maxLength}
					disabled={disabled}
					/>
		</div>
	)
}
