import MyButton from "./utils/Button.tsx"
import Img from "./utils/Img.tsx"
import Main from "./utils/Main.tsx"
import { useEffect, useState } from "react";
import { useLang } from "./script/langProvider.tsx";
import "./styles/index.css";
import { verifToken } from "./script/utils.ts";

async function getUsername()
{
	try
	{
		const token = localStorage.getItem("token");
		if (!token) {
			console.log("Token not found");
			return false;
		}
		const res = await fetch('/user/profile', {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}` 
			}
		});
		const data = await res.json();
		if (data.success === false || !data.user)
			return null;
		return data.user.pseudo;
	}
	catch (error)
	{
		console.log("Invalid token:", error);
		return null;
	}
}

async function updateEmail(email: string) {
	try
	{
		const token = localStorage.getItem("token");
		if (!token) {
			console.log("Token not found");
			return { success: false, error: "Token not found" };
		}
		const res = await fetch('/user/email', {
			method: "PUT",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ email })
		});
		const data = await res.json();
		if (data.success === false)
			return { success: false, error: data?.error || "Error updating email" };
		return { success: true };
	}
	catch (error)
	{
		console.log("Email update error:", error);
		return { success: false, error: "Error updating email" };
	}
}

async function getEmail() {
	try
	{
		const token = localStorage.getItem("token");
		if (!token) {
			console.log("Token not found");
			return "";
		}
		const res = await fetch('/user/email', {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			}
		});
		const data = await res.json();
		if (data.success === false)
			return "";
		return data?.user?.email ?? data?.email ?? "";
	}
	catch (error)
	{
		console.log("Error fetching email:", error);
		return "";
	}
}

async function ProfilePicture(messages: { generic_error_occurred: string; generic_error: string }) {
	const token = localStorage.getItem("token");
	try
	{
		const res = await fetch("/user/useravatar", {
			method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				}
				
			});
		const data = await res.json();
		if (data.success === false)
			return "/default-avatar.png";
		return data.avatarUrl || "/default-avatar.png";
	}
	catch (err)
	{
		console.log("Error fetching profile picture:", err);
		return "/default-avatar.png";
	}
}
async function changeProfilePicture(file: File, messages: {
	no_file_provided: string;
	unsupported_image_format: string;
	avatar_upload_error: string;
	generic_error: string;
}) {
	const token = localStorage.getItem("token");
	try
	{
		if (!file) {
			alert(messages.no_file_provided);
			return;
		}

		const allowedMimeTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
		if (!allowedMimeTypes.has(file.type)) {
			alert(messages.unsupported_image_format);
			return;
		}

		const formData = new FormData();
		formData.append("file", file);
		const res = await fetch("/user/avatar", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`
			},
			body: formData
		});
		const data = await res.json();
		if (data.success === false) {
			alert(data?.error || messages.avatar_upload_error);
			return;
		}
		return data.avatarUrl;
	}
	catch (err)
	{
		alert(messages.generic_error);
		console.log(err);
	}
}

async function generateApiKey(messages: {
	api_key_generation_error: string;
	api_key_not_found: string;
	generic_error: string;
}) {
	const token = localStorage.getItem("token");
	try
	{
		const res = await fetch("/user/apikey", {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
			}
		});
		const data = await res.json();
		if (data.success === false) {
			alert(data?.error || messages.api_key_generation_error);
			return;
		}
		const apiKey = data.apiKey;
		if (apiKey) {
			return apiKey;
		} else {
			alert(messages.api_key_not_found);
		}
		return apiKey;
	}
	catch (err)
	{
		alert(messages.generic_error);
		console.log(err);
	}
}

export default function Settings() {
	const token = localStorage.getItem("token");
	if (!token) {
		window.location.href = "/log";
		return null;
	}
	if (!verifToken(token))
	{
		localStorage.removeItem("token");
		window.location.href = "/log";
		console.log("Invalid token, redirecting to login.");
		return null;
	}
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenEmail, setIsOpenEmail] = useState(false);
	const lang = useLang().getLang();
	const username = window.location.pathname.startsWith("/profile/")
		? decodeURIComponent(window.location.pathname.replace("/profile/", ""))
		: null;
	const [loggedUser, setLoggedUser] = useState<string | null>(null);
	const profileToDisplay = username || loggedUser;
	const [newProfilePicture, setNewProfilePicture] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [editedEmail, setEditedEmail] = useState("");
	const [apiKey, setApiKey] = useState("");
	const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const avatarUrl = await changeProfilePicture(file, {
			no_file_provided: lang.Feedback.no_file_provided,
			unsupported_image_format: lang.Feedback.unsupported_image_format,
			avatar_upload_error: lang.Feedback.avatar_upload_error,
			generic_error: lang.Feedback.generic_error,
		});
		if (avatarUrl) {
			setNewProfilePicture(avatarUrl);
		}
		setIsOpen(false);
		window.location.reload();
		event.target.value = "";
	};
	const password = "********";
	useEffect(() => {
		async function fetchUsername() {
			const name = await getUsername();
			if (name)
				setLoggedUser(name);
		}
		fetchUsername();
	}, []);

	useEffect(() => {
		async function fetchProfilePicture() {
			const avatarUrl = await ProfilePicture({
				generic_error_occurred: lang.Feedback.generic_error_occurred,
				generic_error: lang.Feedback.generic_error,
			});
			setNewProfilePicture(avatarUrl);
		}
		fetchProfilePicture();
	}, []);

	useEffect(() => {
		async function fetchEmail() {
			const email = await getEmail();
			setNewEmail(email);
			setEditedEmail(email);
		}
		fetchEmail();
	}, []);
	async function handleSaveEmail() {
		const trimmedEmail = editedEmail.trim();
		if (!trimmedEmail) {
				alert(lang.Feedback.email_required);
			return;
		}

		const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
		if (!isValidEmail) {
			alert(lang.Feedback.invalid_email);
			return;
		}

		const result = await updateEmail(trimmedEmail);
		if (!result.success) {
			alert(result.error || lang.Feedback.email_update_error);
			return;
		}

		const refreshedEmail = await getEmail();
		setNewEmail(refreshedEmail || trimmedEmail);
		setEditedEmail(refreshedEmail || trimmedEmail);
		setIsOpenEmail(false);
	}

	async function handleOpenEmailModal() {
		const currentEmail = await getEmail();
		setNewEmail(currentEmail);
		setEditedEmail(currentEmail);
		setIsOpenEmail(true);
	}

	async function handleGenerateApiKey() {
		const newApiKey = await generateApiKey({
			api_key_generation_error: lang.Feedback.api_key_generation_error,
			api_key_not_found: lang.Feedback.api_key_not_found,
			generic_error: lang.Feedback.generic_error,
		});
		if (newApiKey) {
			setApiKey(newApiKey);
		}
	}

	return (
		<Main>
			<div className="overflow-y-auto flex flex-col items-center h-[calc(85vh-20px)] text-[var(--contrast)] overflow-x-hidden">
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
												accept="image/png,image/jpeg,image/webp"
												onChange={handleFileSelect}
												className="hidden"
											/>
										</div>
										<MyButton className="bg-[var(--background-box)] hover:[background:var(--button)] p-2" onClick={() => setIsOpen(false)}>{lang.Settings_page.close}</MyButton>
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
							<div className="border border-t-0 border-b-0 border-[var(--props)] px-2 py-1 flex flex-col text-[15px]">
								<div className="text-[10px]">
									<p>{lang.Settings_page.email}</p>
								</div>
								<div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 min-w-0">
									<div className="break-all min-w-0">
										{newEmail || lang.Settings_page.no_email}
									</div>
									<div className="flex justify-end pl-1">
											<MyButton className="hover:text-[var(--props)] text-right whitespace-nowrap" onClick={handleOpenEmailModal}>{lang.Settings_page.edit}</MyButton>
									</div>
									{isOpenEmail && (
										<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
											<div className="bg-[var(--background-box-select)] p-6">
												<div className="flex flex-col gap-4">
													<input
														type="email"
															value={editedEmail}
															onChange={(e) => setEditedEmail(e.target.value)}
														className="border border-[var(--default)] bg-[var(--background-box)] p-2 text-sm text-[var(--contrast)] placeholder-[var(--props)] focus:outline-hidden sm:p-2.5 sm:text-base"
													/>
														<MyButton className="bg-[var(--background-box)] hover:[background:var(--button)] p-2" onClick={handleSaveEmail}>{lang.Settings_page.save}</MyButton>
													<MyButton className="bg-[var(--background-box)] hover:[background:var(--button)] p-2" onClick={() => setIsOpenEmail(false)}>{lang.Settings_page.close}</MyButton>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
							<div className="border border-t-0 border-[var(--props)] px-2 py-1 flex flex-col text-[15px]">
								<div className="text-[10px]">
									<p>{lang.Settings_page.api}</p>
								</div>
								<div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 min-w-0">
									<div className="break-all min-w-0">
										{apiKey}
									</div>
									<div className="flex justify-end pl-1">
										<MyButton className="hover:text-[var(--props)] text-right whitespace-nowrap" onClick={() => handleGenerateApiKey()}>{lang.Settings_page.generate}</MyButton>
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