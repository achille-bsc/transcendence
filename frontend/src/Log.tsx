import { useState } from "react";
import RegisterInput  from "./RegisterInput";
import RegisterButton from "./RegisterButton";
import Main from "./utils/Main.tsx"
import { useLang } from "./script/langProvider.tsx";

export default function Log () {

	const [pseudo, setPseudo] = useState("");
	const [password, setPassword] = useState("");
	const lang = useLang().getLang();

	async function handleLogin(e :React.FormEvent) {
		e.preventDefault();

		try {
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
			
			let data: any = {};
			try {
				data = await res.json();
			} catch (parseError) {
				console.log("Erreur de format de réponse :", parseError);
			}

			if (data.success === false || data.error) {
				alert(data.error || lang.Feedback.login_failed || "Erreur de connexion");
				return;
			}

			if (data.token) {
				localStorage.setItem("token", data.token);
				window.location.href = "/";
			} else {
				alert(lang.Feedback.login_failed || "Token introuvable");
			}

		} catch (networkError) {
			console.log("Erreur réseau :", networkError);
			alert(lang.Feedback.login_failed || "Serveur inaccessible. Veuillez réessayer plus tard.");
		}
	}

	return (
		<div className="quantico-regular">
			<Main>
				<div className="overflow-y-auto flex flex-col items-center h-[calc(85vh-20px)] text-[var(--default)] overflow-x-hidden px-3">
					<div className="my-auto bg-[var(--background-box-select)] w-full max-w-[560px]">
						<form onSubmit={handleLogin} className="w-full">
							<div className="flex">
								<div className="w-1/2 min-w-0 p-4 text-center sm:p-5 bg-[var(--background-box-select)] break-all whitespace-normal">{lang.Log_register_page.login}</div>
								<a className="w-1/2 min-w-0 p-4 text-center sm:p-5 bg-[var(--not-selected-items)] break-all whitespace-normal hover:bg-[var(--background-box)]" href="register"><div>{lang.Log_register_page.register}</div></a>
							</div>
							<div className="p-4 sm:p-5 md:p-6">
								<label className="flex justify-center"><br />
									<RegisterInput
										type="text"
										id="name"
										name="name"
										className="w-full border border-[var(--default)] bg-[var(--background-box)] p-2 text-sm text-[var(--contrast)] placeholder-[var(--props)] focus:outline-hidden sm:p-2.5 sm:text-base"
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
										className="w-full border border-[var(--default)] bg-[var(--background-box)] p-2 text-sm text-[var(--contrast)] placeholder-[var(--props)] focus:outline-hidden sm:p-2.5 sm:text-base"
										placeholder={lang.Log_register_page.password}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
										autoComplete="false"
										required
									/>
								</label><br />
								<div className="flex items-center justify-center transition-all duration-200">
									<RegisterButton
										label={lang.Log_register_page.login}
										icon=""
										className="auth-submit-btn w-full bg-[var(--background-box)] p-2 px-5 text-sm text-[var(--white)] focus:outline-2 sm:w-auto sm:text-base break-all whitespace-normal"
									/>
								</div>
							</div>
						</form>
					</div>
				</div>
			</Main>
		</div>
	)
}
