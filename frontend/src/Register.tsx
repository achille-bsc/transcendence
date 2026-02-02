import { useState } from "react";
import MyButton from "./Button"
import  RegisterButton  from "./RegisterButton";

function Register () {

	const [pseudo, setPseudo] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	async function handleRegister(e: React.FormEvent) {
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
			<form 
				onSubmit={handleRegister}
				className="bg-[#282828] w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%]">
				<div className="flex">
					<a className="w-1/2 text-center p-4 sm:p-5 bg-[#202020] cursor-pointe" href="log"><div >Login</div></a>
					<div className="w-1/2 text-center p-4 sm:p-5 cursor-pointer">Register</div>
				</div>
				<div className="p-4 sm:p-5 md:p-6">
					<label className="flex justify-center"><br />
						<input
							type="text"
							id="name"
							name="name"
							className="w-full border p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B]"
							placeholder="name"
							onChange={e => setPseudo(e.target.value)}
							autoComplete="false"
							required
							/>
					</label><br />
					<label className="flex justify-center"><br />
						<input
							type="email"
							id="name"
							name="name"
							className="w-full border p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B]"
							placeholder="email"
							onChange={e => setEmail(e.target.value)}
							autoComplete="false"
							required
							/>
					</label><br />
					<label className="flex justify-center">
						<input
							type="password"
							id="password"
							name="password"
							className="w-full border p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B]"
							placeholder="password"
							onChange={e => setPassword(e.target.value)}
							autoComplete="false"
							required
							/>
					</label><br />
					<label className="flex justify-center">
						<input
							type="password"
							id="password"
							name="password"
							className="w-full border p-2 sm:p-2.5 text-sm sm:text-base bg-[#3A3A3A] placeholder-[#9B9B9B]"
							placeholder="confirm password"
							onChange={e => setConfirmPassword(e.target.value)}
							autoComplete="false"
							required
							/>
					</label><br />
					<RegisterButton label="Coucou" className=""/>
				</div>
			</form>
			
			{/* <div className="flex justify-center items-center h-10 scale-300 scale-y-30">
				<img src="../icons/ligne.png"/>
			</div>
			<div className="flex justify-center items-center">
				<MyButton onClick={() => 42}>
					<img src="../icons/github.png" href="https://github.com/achille-bsc/transcendence"/>
				</MyButton>
			</div> */}
		</div>
	)
}

export default Register

/// username password email et token
