import "./styles/index.css";
import { useEffect } from "react";
import { useLang } from './script/langProvider';

export default function NotFound() {
	useEffect(() => {
		const savedTheme = localStorage.getItem("darkMode") || "dark";
		document.documentElement.classList.remove("light", "dark");
		document.documentElement.classList.add(savedTheme);
	}, []);
	const lang = useLang().getLang();

	return (
		<div className="quantico-regular flex min-h-screen w-full flex-col items-center justify-center bg-[var(--background)] px-4 text-center">
			<h1 className="text-[120px] font-bold leading-none text-[var(--default)] sm:text-[180px] md:text-[220px]">
				404
			</h1>
			<p className="mt-2 text-[20px] font-semibold text-[var(--contrast)] sm:text-[28px] md:text-[34px]">
				{lang.not_found.title}
			</p>
			<p className="mt-3 max-w-md text-[14px] text-[var(--props)] sm:text-[16px] md:max-w-lg md:text-[18px]">
				{lang.not_found.message}
			</p>
			<a
				href="/"
				className="mt-8 inline-block cursor-pointer px-8 py-3 text-[14px] font-semibold text-[var(--white)] transition-opacity hover:opacity-70 sm:px-10 sm:py-3.5 sm:text-[16px] md:text-[18px] m-[15px]"
				style={{ background: "var(--button)" }}
			>
				{lang.not_found.home_button}
			</a>
		</div>
	);
}