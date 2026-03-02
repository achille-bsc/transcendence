import { useState } from "react";
import MyButton from "./Button"
import RegisterInput  from "./RegisterInput";
import RegisterButton from "./RegisterButton";
import Main from "./utils/Main.tsx"
import { useLang } from "./script/langProvider.tsx";
import '../node_modules/tailwindcss/index.css';

export default function Log () {

	const [pseudo, setPseudo] = useState("");
	const [password, setPassword] = useState("");
	const lang = useLang().getLang();

	async function handleGithubLogin() {
		alert("CLICK GITHUB");
		const githubAuthUrl = "https://github.com/login/oauth/authorize" +
			"?client_id=" + process.env.REACT_APP_GITHUB_CLIENT_ID +
			"&redirect_uri=" + encodeURIComponent("oauth/callback") +
			"&scope=user:email";
		window.location.href = githubAuthUrl;
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
			<div className="quantico-regular">
				<Main>
					<div className="w-full place-items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
						<form
							onSubmit={handleLogin}
							className="bg-[var(--background-box-select)] w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%]">
							<div className="flex">
								<div className="w-1/2 text-center p-4 sm:p-5 cursor-pointer">{lang.Log_register_page.login}</div>
								<a className="w-1/2 text-center p-4 sm:p-5 bg-[var(--not-selected-items)] cursor-pointer" href="register"><div >{lang.Log_register_page.register}</div></a>
							</div>
							<div className="p-4 sm:p-5 md:p-6">
								<label className="flex justify-center"><br />
									<RegisterInput
										type="text"
										id="name"
										name="name"
										className="w-full focus:outline-hidden border p-2 sm:p-2.5 text-sm sm:text-base bg-[var(--background-box)] placeholder-[var(--props)] border-[var(--default)] text-[--contrast]"
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
										className="w-full focus:outline-hidden border p-2 sm:p-2.5 text-sm sm:text-base bg-[var(--background-box)] placeholder-[var(--props)] border-[var(--default)] text-[--contrast]"
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
										className="w-full sm:w-auto p-2 px-5 text-sm sm:text-base bg-[var(--background-box)] hover:[background:var(--button)] focus:outline-2 text-[var(--white)]"
										/>
								</div>
							</div>
						</form>
						<div className="bg-[var(--background-box-select)] justify-center w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%]">
							<div className="flex items-center justify-center">
								<RegisterButton
									icon="github"
									className="py-4 px-[35%] sm:w-auto border-t-2 border-[var(--default)] place-items-center w-full p-2 px-2 text-sm sm:text-base"
									onClick={handleGithubLogin}
									/>
							</div>
						</div>
					</div>
				</Main>
			</div>
	)
}
