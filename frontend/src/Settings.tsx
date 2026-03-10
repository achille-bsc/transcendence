import MyButton from "./utils/Button.tsx"
import Img from "./utils/Img.tsx"
import Main from "./utils/Main.tsx"
import { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

async function ProfilePicture() {
	const token = localStorage.getItem("token");
	try
	{
		const res = await fetch("/api/db/useravatar", {
			method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				}
				
			});
		if (!res.ok)
			alert("An error occured");
		const data = await res.json();
		return data.avatarUrl;
	}
	catch (err)
	{
		alert("ERROR");
		console.log(err);
		return;
	}
}

async function changeProfilePicture(file: File) {
	const token = localStorage.getItem("token");
	try
	{
		if (!file) {
			alert("No file provided");
			return;
		}
		const formData = new FormData();
		formData.append("file", file);
		const res = await fetch("/api/db/avatar", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`
			},
			body: formData
		});
		if (!res.ok) {
			alert("An error occured");
			return;
		}
		const data = await res.json();
		return data.avatarUrl;
	}
	catch (err)
	{
		alert("ERROR");
		console.log(err);
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
	const [isOpen, setIsOpen] = useState(false);
	const lang = useLang().getLang();
	const navigate = useNavigate();
	const { username } = useParams();
	const [loggedUser, setLoggedUser] = useState(null);
	const profileToDisplay = username || loggedUser;
	const [newProfilePicture, setNewProfilePicture] = useState("");
	const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const avatarUrl = await changeProfilePicture(file);
		if (avatarUrl) {
			setNewProfilePicture(avatarUrl);
		}
		setIsOpen(false);
		window.location.reload();
	};
	const password = "********";
	const email = "SuperKiwiLaLegendDu7680salutCoucoucKiwilolfdsfsfesfd@help.help";
	const apiKey = "API_KEY";
	useEffect(() => {
		async function fetchUsername() {
			const name = await getUsername();
			setLoggedUser(name);
		}
		fetchUsername();
	}, []);

	useEffect(() => {
		async function fetchProfilePicture() {
			const avatarUrl = await ProfilePicture();
			setNewProfilePicture(avatarUrl);
		}
		fetchProfilePicture();
	}, []);

	// function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
	// 	if (e.key === "Enter") {
	// 		localStorage.setItem("profile_img", (e.target as HTMLInputElement).value);
	// 		localStorage.setItem("img", (e.target as HTMLInputElement).value);
	// 		setIsOpen(false);
	// 	}
	// }

	return (
		<Main>
			<div className="quantico-regular overflow-y-auto flex flex-col items-center h-[calc(85vh-20px)] text-[var(--contrast)] overflow-x-hidden">
				<div className="my-auto bg-[var(--background-box-select)] p-5">
					<div className="place-items-left">
						<div onClick={() => setIsOpen(true)} className="place-items-center p-2 pb-6 px-9">
							<Img src={newProfilePicture} alt={lang.Alt_text.profile_picture} className="ring-2 ring-offset-4 ring-offset-[var(--background-box)] ring-[var(--default)] w-[80px] h-[80px] rounded-full object-cover object-center block mx-auto hover:opacity-70"/>
						</div>
						{isOpen && (
							<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
								<div className="bg-[var(--background-box-select)] p-6">
									<div className="flex flex-col gap-4">
										<div className="flex flex-row overflow-x-auto pb-2">
											<label htmlFor="fileInput" className="size-35 hover:opacity-70 flex justify-center place-items-center">
												<div className="flex flex-col justify-center items-center gap-2">
													<Img src={newProfilePicture} alt={lang.Alt_text.profile_picture} className="w-[140px] h-[140px] rounded-full object-cover object-center block mx-auto"></Img>
													<div className="absolute text-[35px] opacity-70">+</div>
												</div>
											</label>
											<input 
												id="fileInput"
												type="file" 
												accept="image/*"
												onChange={handleFileSelect}
												className="hidden"
											/>
										</div>
										<MyButton className="bg-[var(--background-box)] hover:[background:var(--button)] p-2" onClick={() => setIsOpen(false)}>Fermer</MyButton>
									</div>
								</div>
							</div>
						)}

						<div className="p-2 bg-[var(--background-box)]">
							<div className="border border-b-0 border-[var(--props)] px-2 py-1 flex flex-col text-[15px]">
								<div className="text-[10px]">
									<p>{lang.Settings_page.pseudo}</p>
								</div>
								<div className="grid grid-cols-6 gap-2">
								<div className="col-span-5 break-words">
										{profileToDisplay}
									</div>
								</div>
							</div>
							<div className="border border-t-0 border-b-0 border-[var(--props)] px-2 py-1 flex flex-col text-[15px]">
								<div className="text-[10px]">
									<p>{lang.Settings_page.password}</p>
								</div>
								<div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 min-w-0">
									<div className="break-all min-w-0">
										<p>{password}</p>
									</div>
								</div>
							</div>
							<div className="border border-t-0 border-[var(--props)] px-2 py-1 flex flex-col text-[15px]">
								<div className="text-[10px]">
									<p>{lang.Settings_page.email}</p>
								</div>
								<div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 min-w-0">
									<div className="break-all min-w-0">
										{email}
									</div>
									<div className="flex justify-end pl-1">
										<MyButton className="hover:text-[var(--props)] text-right whitespace-nowrap" onClick={() => editProfile()}>{lang.Settings_page.edit}</MyButton>
									</div>
								</div>
							</div>
							{/* <div className="border border-t-0 border-[var(--props)] px-2 py-1 flex flex-col text-[15px]">
								<div className="text-[10px]">
									<p>{lang.Settings_page.api}</p>
								</div>
								<div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 min-w-0">
									<div className="break-all min-w-0">
										{apiKey}
									</div>
									<div className="flex justify-end pl-1">
										<MyButton className="hover:text-[var(--props)] text-right whitespace-nowrap" onClick={() => editProfile()}>{lang.Settings_page.generate}</MyButton>
									</div>
								</div>
							</div> */}
						</div>
					</div>
				</div>
			</div>
		</Main>
	);
}