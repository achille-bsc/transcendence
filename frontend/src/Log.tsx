import { useState } from "react";
import MyButton from "./Button"
import RegisterInput  from "./RegisterInput";
import RegisterButton from "./RegisterButton";
import Main from "./utils/Main.tsx"
import { useLang } from "./script/langProvider.tsx";
import '../node_modules/tailwindcss/index.css';

function Log () {

	const [pseudo, setPseudo] = useState("");
	const [password, setPassword] = useState("");
	const lang = useLang().getLang();

	async function handleGithubLogin() {
		const git_res = await fetch("", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		//ne redirige nul part
		const data = await git_res.json();
		if (!git_res.ok) {
			alert(data.error || "Registration failed");
			return;
		}
		const token = data.token;
		localStorage.setItem("token", token);
		console.log("salutttttt");
		window.location.href = "/";
	}
	
	async function handleLogin(e :React.FormEvent) {
		console.log("P = ", pseudo, " PASS = ", password,);
		e.preventDefault();

		const res = await fetch("/api/db/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				log_name: pseudo,
				password: password,
			}),
		});
		
		const data = await res.json();

		if (!res.ok) {
			alert(data.error || "Registration failed");
			return;
		}
		const token = data.token;
		localStorage.setItem("token", token);
		window.location.href = "/";
	}

	return (
			<div className="w-full">
				<div className="w-full place-items-center">
					<form
						onSubmit={handleLogin}
						className="bg-[#282828] w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%]">
						<div className="flex">
							<div className="w-1/2 text-center p-4 sm:p-5 cursor-pointer">{lang.Log_register_page.login}</div>
							<a className="w-1/2 text-center p-4 sm:p-5 bg-[#202020] cursor-pointer" href="register"><div >{lang.Log_register_page.register}</div></a>
						</div>
						<div className="p-4 sm:p-5 md:p-6">
							<label className="flex justify-center"><br />
								<RegisterInput
									type="text"
									id="name"
									name="name"
									className="w-full border p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B] border-[#6E3CA3] text-[#ffffff]"
									placeholder={lang.Log_register_page.pseudo_email}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPseudo(e.target.value)}
									autoComplete="false"
									required
									/>
							</label><br />

							<label className="flex justify-center">
								<RegisterInput
									type="password"
									id="password"
									name="password"
									className="w-full border p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B] border-[#6E3CA3] text-[#ffffff]"
									placeholder={lang.Log_register_page.password}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
									autoComplete="false"
									required
									/>
							</label><br />
							<div className="flex justify-center items-center transition-all duration-200 ">
								<RegisterButton
									label={lang.Log_register_page.login}
									icon=""
									className="w-full sm:w-auto p-2 px-5 text-sm sm:text-base bg-[#3A3A3A] hover:bg-linear-[90deg,#6E3CA3,#A82828] focus:outline-2 text-[#FFFFFF]"
									/>
							</div>
						</div>
					</form>
					<div className="bg-[#282828] justify-center w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%]">
						<div className="flex items-center justify-center">
							<RegisterButton
								icon="github"
								className="py-4 px-[35%] border-t-2 border-[var(--violet-default)] place-items-center w-full sm:w-auto p-2 px-2 text-sm sm:text-base bg-[#282828]"
								onClick={handleGithubLogin}
								/>
						</div>
					</div>
				</div>
			</div>
	)
}
// w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%]
export default Log

//return de l'ID pseudo email et token
