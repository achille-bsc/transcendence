// import React from "react";
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter as Router, Routes, Route } from "react-router";
import './styles/index.css'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

const root = document.getElementById("root");

import Home from './Home.tsx'
import Register from './Register.tsx'
import Log from './Log.tsx'
import Chat from './Chat.tsx'
import ChatDm from './ChatDm.tsx'
import Profile from './Profile.tsx'
// import Button from './Button.tsx'
import Game from './Game.tsx'
import { LangProvider } from "./script/langProvider.tsx";
import Conversation from "./Conversation.tsx";
import Settings from "./Settings.tsx";
import GithubCallback from "./script/GithubCallback.tsx";
import Terms_of_Services from "./Terms_of_Services.tsx";
import NotFound from "./404.tsx";

ReactDOM.createRoot(root!).render(
	<BrowserRouter>
		<LangProvider>
			<Routes>
				<Route path="/oauth/callback" element={<GithubCallback />} />
				<Route path="/dm" element={<ChatDm />} />
				<Route path="/settings" element={<Settings />} />
				<Route path="*" element={<NotFound />} />
				<Route path="/dm/:pseudo" element={<Conversation />} />
				<Route path="/terms" element={<Terms_of_Services />} />
				<Route path="/game" element={<Game />} />
				<Route path="/" element={<Home />} />
				<Route path="/log" element={<Log />} />
				<Route path="/register" element={<Register />} />
				<Route path="/chat" element={<Chat />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/profile/:username" element={<Profile />} />
			</Routes>
		</LangProvider>
	</BrowserRouter>,
);
