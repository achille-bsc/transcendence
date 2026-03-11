import { useState } from "react";
import  RegisterInput  from "./RegisterInput";
import RegisterButton from "./RegisterButton";
import { useLang } from './script/langProvider.tsx';
import Main from "./utils/Main.tsx"

export default function Register () {

	const [pseudo, setPseudo] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const lang = useLang().getLang();

	// Dans frontend/src/Register.tsx
	async function handleRegister(e: React.FormEvent) {
		e.preventDefault();

		if (password != confirmPassword) {
			alert(lang.Feedback.password_mismatch);
			return ;
		}
		/*if (!pseudo || !email || !password)
		{
			alert(lang.Feedback.password_mismatch);
			return false
		}
		else if (password.length < 8)
		{
			alert(lang.Feedback.password_mismatch);
			return false
		}
		else if (!email || email.length === 0 || email.includes(' ') ||
			email.split('@').length !== 2 || !email.includes('.'))
		{
			alert(lang.Feedback.password_mismatch);
			return false
		}
		else if (!pseudo || pseudo.length === 0 || pseudo.includes(' ') || pseudo.includes('@'))
		{
			alert(lang.Feedback.password_mismatch);
			return false
		}*/
		try {
			
			const res = await fetch("/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					pseudo,
					email,
					password,
				}),
			});

			let data: any = {};
			try {
				data = await res.json();
			} catch (parseError) {
				console.log("Erreur de format de réponse :", parseError);
			}

			if (data.success === false || data.error) {
				alert(data.error || lang.Feedback.registration_failed || "Erreur lors de l'inscription");
				return;
			}

			if (data.token) {
				localStorage.setItem("token", data.token);
				window.location.href = "/";
			} else {
				alert(lang.Feedback.registration_failed || "Token introuvable après l'inscription");
			}

		} catch (networkError) {
			console.log("Erreur réseau :", networkError);
			alert(lang.Feedback.registration_failed || "Serveur inaccessible. Veuillez réessayer plus tard.");
		}
	}

	return (
		<div className="quantico-regular">
			<Main>
				<div className="overflow-y-auto flex flex-col items-center h-[calc(85vh-20px)] text-[var(--default)] overflow-x-hidden px-3">
					<div className="my-auto bg-[var(--background-box-select)] w-full max-w-[560px]">
						<form 
							onSubmit={handleRegister}
							className="w-full auth-form-register">
							<div className="auth-tabs">
								<a className="auth-tab auth-tab-unselected hover:bg-[var(--background-box)] min-w-0 break-all whitespace-normal" href="log"><div >{lang.Log_register_page.login}</div></a>
								<div className="auth-tab auth-tab-selected min-w-0 break-all whitespace-normal">{lang.Log_register_page.register}</div>
							</div>
							<div className="auth-fields">
								<label className="auth-label"><br />
									<RegisterInput
										type="text"
										id="name"
										name="name"
										className="auth-input"
										placeholder={lang.Log_register_page.pseudo}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPseudo(e.target.value)}
										autoComplete="false"
										required
										/>
								</label><br />
								<label className="auth-label"><br />
									<RegisterInput
										type="email"
										id="email"
										name="email"
										className="auth-input"
										placeholder={lang.Log_register_page.email}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
								<label className="auth-label">
									<RegisterInput 
										type="password"
										id="confirmpassword"
										name="confirmpassword"
										className="auth-input"
										placeholder={lang.Log_register_page.confirm_password}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
										autoComplete="false"
										required
										/>
								</label><br />
								<div className="auth-submit-wrap">
									<RegisterButton
										label={lang.Log_register_page.register}
										icon=""
										className="auth-submit-btn break-all whitespace-normal"
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
