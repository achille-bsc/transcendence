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

	async function handleRegister(e: React.FormEvent) {
		console.log("P = ", pseudo, " E = ", email, " PASS = ", password, " CPASS = ", confirmPassword);
		e.preventDefault();

		if (password != confirmPassword)
		{
			alert(lang.Feedback.password_mismatch);
			return ;
		}

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

		if (!res.ok) {
			alert(await res.json() || lang.Feedback.registration_failed);
			return;
		}
		const data = await res.json();

		const token = data.token;
		localStorage.setItem("token", token);
		window.location.href = "/";
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
