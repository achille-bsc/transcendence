interface ButtonProps {
	label?: string;
	icon?: string;
	className?: string;
	onClick?: () => void;
	autoComplete?:string;
}

export default function TryButton ({label, className, onClick} : ButtonProps) {

	return (
		<button className={className} onClick={onClick} >
			{label}
		</button>
	)
}