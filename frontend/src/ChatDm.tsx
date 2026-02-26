import { useState } from "react";
import { verifToken } from "./script/utils";
import ChatInput from "./ChatInput";
import Main from "./utils/Main.tsx"
import SendMsg from "./SendMsg";
import { useLang } from "./script/langProvider.tsx";
import RegisterButton from "./RegisterButton";
import Sidebar from "./script/Sidebar_dm.tsx";
import ChatInputBar from "./ChatInputBar.tsx";

export default function ChatDm ({children = ""}) {

	let isAuth = false;
	const token = localStorage.getItem('token')
	if (token)
	{
		if (!verifToken(token))
		{
			window.location.href = "/log";
		}
		else
		{
				isAuth = true;
		}
	}
	else
		window.location.href = "/log";

	
	return (
		<div className="bg-[var(--background)] min-h-screen">
			<Main>
				<Sidebar>{children}</Sidebar>
			</Main>
		</div>
	)
}