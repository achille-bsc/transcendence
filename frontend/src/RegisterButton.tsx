
interface ButtonProps {
	label: string;
	type?: string;
	className?: string;
	internClassName?: string;
}

export default function RegisterButton ({label, type = "submit", className, internClassName} : ButtonProps) {
	
	return (
		<div className={className ? className : "flex justify-center items-center transition-all duration-200 "}>
			<input
				type={type}
				value={label}
				className={internClassName ? internClassName :"w-full sm:w-auto p-2 px-5 text-sm sm:text-base bg-[#3A3A3A] hover:bg-linear-[90deg,#6E3CA3,#A82828] focus:outline-2 text-[#FFFFFF]"}
				/>
		</div>
	)
}