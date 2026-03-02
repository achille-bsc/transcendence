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
					<div className="relative w-full place-items-center h-[calc(85vh-20px)] flex flex-col overflow-y-auto">
						<div className="my-auto">
							<form
								onSubmit={handleLogin}
								className="bg-[var(--background-box-select)] w-[50vw]">
								<div className="flex">
									<div className="w-1/2 text-center p-4 sm:p-5 bg-[var(--background-box-select)] cursor-pointer">{lang.Log_register_page.login}</div>
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
							<div className="bg-[var(--background-box-select)] justify-center w-[50vw] flex flex-row-3">
								<div className="border-t-2">
									<RegisterButton
										icon="github"
										className="p-4 px-[15vw] justify-center"
										onClick={handleGithubLogin}
										/>
								</div>
							</div>
						</div>
					</div>
				</Main>
			</div>
	)
}
