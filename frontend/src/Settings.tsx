import MyButton from "./utils/Button.tsx"
import Img from "./utils/Img.tsx"
import Main from "./utils/Main.tsx"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLang } from "./script/langProvider.tsx";
import "./styles/index.css";
import RegisterInput from "./RegisterInput.tsx";

async function getUsername()
{
	try
	{
		const token = localStorage.getItem("token");
		if (!token) {
			console.error("Token not found");
			return false;
		}
		const res = await fetch('/api/db/profileuser', {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}` 
			}
		});
		const data = await res.json();
		return data.user.pseudo;
	}
	catch (error)
	{
		console.error("Invalid token:", error);
		return false;
	}
}

async function editProfile() {
	alert("Editing profile...");
}

export default function Settings() {
	const token = localStorage.getItem("token");
	if (!token) {
		window.location.href = "/log";
		return null;
	}
	async function sendRequest() {
		try
		{
			const res = await fetch("/api/db/friend/send", {
			method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				}
			});
			console.log("RESS", res);
			if (!res.ok)
				alert("An error occured");
			const data = await res.json()
			console.log(data);
		}
		catch (err)
		{
			alert("ERROR");
			console.log(err);
			return;
		}
	}
	const [isOpen, setIsOpen] = useState(false);
	const lang = useLang().getLang();
	const { username } = useParams();
	const [loggedUser, setLoggedUser] = useState(null);
	const profileToDisplay = username || loggedUser;
	const picture = localStorage.getItem("img") || "/default-profile.png";
	const profile_picture = "";
	const password = "coucou";
	const email = "coucou@coucou.coucou";

	function changeProfilePicture(picture: string) {
		if (picture !== "/src/img/img.webp")
			localStorage.setItem("img", picture);
		localStorage.setItem("profile_img", picture);
		setIsOpen(false);
	}

	function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			localStorage.setItem("profile_img", (e.target as HTMLInputElement).value);
			localStorage.setItem("img", (e.target as HTMLInputElement).value);
			setIsOpen(false);
		}
	}

	return (
		<Main>
			<div className="overflow-y-auto flex flex-col items-center h-[calc(85vh-20px)] text-[var(--contrast)] overflow-x-hidden">
				<div className="my-auto bg-[var(--background-box-select)] p-5">
					<div className="place-items-left">
						<div onClick={() => setIsOpen(true)} className="place-items-center p-2 pb-6 px-9">
							<Img src={profile_picture} alt={lang.Alt_text.profile_picture} className="ring-2 ring-offset-4 ring-offset-[var(--background-box)] ring-[var(--default)] aspect-square w-[80px] rounded-full object-cover hover:opacity-70"/>
						</div>
						{isOpen && (
							<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
								<div className="bg-[var(--background-box-select)] p-6 w-96">
									<div className="flex flex-row overflow-x-auto pb-2">
										<div onClick={() => changeProfilePicture(picture)} className="mr-5 flex-none">
											<Img
												src={picture}
												alt={lang.Alt_text.profile_picture}
												className="size-35 object-cover hover:opacity-70">
											</Img>
										</div>
										<div onClick={() => changeProfilePicture("/src/img/img.webp")} className="mr-5 bg-[var(--background-box)] flex-none">
											<Img
												src="/src/img/img.webp"
												alt={lang.Alt_text.profile_picture}
												className="size-35 object-cover hover:opacity-70">
											</Img>
										</div>
									</div>
									<input placeholder="picture URL" className="border mt-5 border-[var(--default)]" onKeyDown={onInputKeyDown}/>
								</div><MyButton onClick={() => setIsOpen(false)}>Fermer</MyButton>
							</div>
						)}

						<div className="p-2 bg-[var(--background-box)]">
							<div className="border border-b-0 border-[var(--props)] px-2 py-1 flex flex-col text-[15px]">
								<div className="text-[10px]">
									<p>{lang.Log_register_page.pseudo} :</p>
								</div>
								<div className="grid grid-cols-6 gap-2">
									<div className="col-span-5">
										{profileToDisplay}
									</div>
									<div className="col-span-1">
										<MyButton className="hover:text-[var(--props)]" onClick={() => editProfile()}>edit</MyButton>
									</div>
								</div>
							</div>
							<div className="border border-t-0 border-b-0 border-[var(--props)] px-2 py-1 flex flex-col text-[15px]">
								<div className="text-[10px]">
									<p>{lang.Log_register_page.password} :</p>
								</div>
								<div className="grid grid-cols-6 gap-2">
									<div className="col-span-5">
										<p>{password}</p>
									</div>
									<div className="col-span-1">
										<MyButton className="hover:text-[var(--props)]" onClick={() => editProfile()}>edit</MyButton>
									</div>
								</div>
							</div>
							<div className="border border-t-0 border-[var(--props)] px-2 py-1 flex flex-col text-[15px]">
								<div className="text-[10px]">
									<p>{lang.Log_register_page.email} :</p>
								</div>
								<div className="grid grid-cols-6 gap-2">
									<div className="col-span-5">
										{email}
									</div>
									<div className="col-span-1">
										<MyButton className="hover:text-[var(--props)]" onClick={() => editProfile()}>edit</MyButton>
									</div>
								</div>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</Main>
	);
}