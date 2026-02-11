import { useState } from "react";
import  RegisterInput  from "./RegisterInput";
import RegisterButton from "./RegisterButton";
import { useLang } from './script/langProvider.tsx';
import Help from "./Help.tsx";

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

		const res = await fetch("http://database-service:5000/signin", {
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
		window.location.href = "/log";
	}

	return (
		<div className="bg-[#1E1E1E] min-h-screen flex items-center justify-center text-[#6E3CA3]">
			<Help/>
			<form 
				onSubmit={handleRegister}
				className="bg-[#282828] w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%]">
				<div className="flex">
					<a className="w-1/2 text-center p-4 sm:p-5 bg-[#202020] cursor-pointe" href="log"><div >{lang.navigation.game}</div></a>
					<div className="w-1/2 text-center p-4 sm:p-5 cursor-pointer">{lang.navigation.game}</div>
				</div>
				<div className="p-4 sm:p-5 md:p-6">
					<label className="flex justify-center"><br />
						<RegisterInput
							type="text"
							id="name"
							name="name"
							className="w-full border p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B] border-[#6E3CA3] text-[#ffffff]"
							placeholder={lang.navigation.friends}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPseudo(e.target.value)}
							autoComplete="false"
							required
							/>
					</label><br />
					<label className="flex justify-center"><br />
						<RegisterInput
							type="email"
							id="name"
							name="name"
							className="w-full border p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B] border-[#6E3CA3] text-[#ffffff]"
							placeholder={lang.navigation.leaderboard}
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
							placeholder={lang.navigation.settings}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
							placeholder={lang.navigation.chat}
                    	    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
							autoComplete="false"
							required
							/>
					</label><br />
					<div className="flex justify-center items-center transition-all duration-200 ">
						<RegisterButton
							label={lang.navigation.game}
							icon=""
							className="w-full sm:w-auto p-2 px-5 text-sm sm:text-base bg-[#3A3A3A] hover:bg-linear-[90deg,#6E3CA3,#A82828] focus:outline-2 text-[#FFFFFF]"
							/>
					</div>
				</div>
			</form>
		</div>
	)
}

export default Register

/// username password email et token
