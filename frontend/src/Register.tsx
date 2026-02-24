import { useState } from "react";
import  RegisterInput  from "./RegisterInput";
import RegisterButton from "./RegisterButton";
import { useLang } from './script/langProvider.tsx';
import Main from "./utils/Main.tsx"
import '../node_modules/tailwindcss/index.css';

function Register () {

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
			alert("Password doesn't match");
			return ;
		}

		const res = await fetch("/api/db/signin", {
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

		const data = await res.json();

		if (!res.ok) {
			alert(data.error || "Registration failed");
			return;
		}

		localStorage.setItem("token", data.token);
		localStorage.setItem("username", pseudo);
		window.location.href = "/log";
	}

	return (
		<div className="bg-[var(--background)]">
			<Main>
				<div className="w-full flex place-items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
					<form 
						onSubmit={handleRegister}
						className="bg-[#282828] w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%]">
						<div className="flex">
							<a className="w-1/2 text-center p-4 sm:p-5 bg-[#202020] cursor-pointer" href="log"><div >{lang.Log_register_page.login}</div></a>
							<div className="w-1/2 text-center p-4 sm:p-5 cursor-pointer">{lang.Log_register_page.register}</div>
						</div>
						<div className="p-4 sm:p-5 md:p-6">
							<label className="flex justify-center"><br />
								<RegisterInput
									type="text"
									id="name"
									name="name"
									className="w-full border p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B] border-[#6E3CA3] text-[#ffffff]"
									placeholder={lang.Log_register_page.pseudo}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPseudo(e.target.value)}
									autoComplete="false"
									required
									/>
							</label><br />
							<label className="flex justify-center"><br />
								<RegisterInput
									type="email"
									id="email"
									name="email"
									className="w-full border p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B] border-[#6E3CA3] text-[#ffffff]"
									placeholder={lang.Log_register_page.email}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
							<label className="flex justify-center">
								<RegisterInput 
									type="password"
									id="confirmpassword"
									name="confirmpassword"
									className="w-full border p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B] border-[#6E3CA3] text-[#ffffff]"
									placeholder={lang.Log_register_page.confirm_password}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
									autoComplete="false"
									required
									/>
							</label><br />
							<div className="flex justify-center items-center transition-all duration-200 ">
								<RegisterButton
									label={lang.Log_register_page.register}
									icon=""
									className="w-full sm:w-auto p-2 px-5 text-sm sm:text-base bg-[#3A3A3A] hover:bg-linear-[90deg,#6E3CA3,#A82828] focus:outline-2 text-[#FFFFFF]"
									/>
							</div>
						</div>
					</form>
				</div>
			</Main>
		</div>
	)
}

export default Register
