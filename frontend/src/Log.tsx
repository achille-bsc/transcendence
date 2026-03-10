import { useState } from "react";
import MyButton from "./Button"
import RegisterInput  from "./RegisterInput";
import RegisterButton from "./RegisterButton";
import Main from "./utils/Main.tsx"
import { useLang } from "./script/langProvider.tsx";

export default function Log () {

	const [pseudo, setPseudo] = useState("");
	const [password, setPassword] = useState("");
	const lang = useLang().getLang();

	async function handleGithubLogin() {
		const githubId = process.env.GITHUB_CLIENT_ID; //temporary
		if (!githubId)
		{
			alert("Missing github application id");
			return;
		}
		const redirectUri = encodeURIComponent("https://localhost:8443/oauth/callback");
		const githubAuthUrl = "https://github.com/login/oauth/authorize" +
			"?client_id=" + githubId +
			"&redirect_uri=" + redirectUri +
			"&scope=user:email";
		window.location.href = githubAuthUrl;
	} 

	async function handleLogin(e :React.FormEvent) {
		console.log("P = ", pseudo, " PASS = ", password,);
		e.preventDefault();

		const res = await fetch("/auth/login", {
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
					<div className="auth-layout">
						<div className="auth-card-wrap">
							<form
								onSubmit={handleLogin}
								className="auth-form">
								<div className="auth-tabs">
									<div className="auth-tab auth-tab-selected">{lang.Log_register_page.login}</div>
									<a className="auth-tab auth-tab-unselected" href="register"><div >{lang.Log_register_page.register}</div></a>
								</div>
								<div className="auth-fields">
									<label className="auth-label"><br />
										<RegisterInput
											type="text"
											id="name"
											name="name"
											className="auth-input"
											placeholder={lang.Log_register_page.pseudo_email}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPseudo(e.target.value)}
											autoComplete="false"
											required
											/>
									</label><br />

									<label className="auth-label">
										<RegisterInput
											type="password"
											id="password"
											name="password"
											className="auth-input"
											placeholder={lang.Log_register_page.password}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
											autoComplete="false"
											required
											/>
									</label><br />
									<div className="auth-submit-wrap">
										<RegisterButton
											label={lang.Log_register_page.login}
											icon=""
											className="auth-submit-btn"
											/>
									</div>
								</div>
							</form>
							<div className="auth-oauth-row">
								<div className="auth-oauth-inner">
									<RegisterButton
										icon="github"
										className="auth-oauth-btn"
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
