interface BoxProps {
	type?: string;
	id?:string;
	name?:string;
	className?: string;
}

export default function ChatBox ({type, id, name, className} : BoxProps) {

	return (
		<div className="w-full">
			<input
				type={type}
				id={id}
				name={name}
				className={className}
				/>
		</div>
	)
}