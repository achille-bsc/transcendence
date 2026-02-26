// import React from "react";
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter as Router, Routes, Route } from "react-router";
import './index.css'
import React from "react";
import '../node_modules/tailwindcss/index.css';
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
import GithubCallback from "./script/GithubCallback.tsx";

ReactDOM.createRoot(root!).render(
	<BrowserRouter>
		<LangProvider>
			<Routes>
				<Route path="/oauth/callback" element={<GithubCallback />} />
				<Route path="/conversation/:conversationId" element={<Conversation />} />
				<Route path="/game" element={<Game />} />
				<Route path="/" element={<Home />} />
				<Route path="/log" element={<Log />} />
				<Route path="/register" element={<Register />} />
				<Route path="/chat" element={<Chat />} />
				<Route path="/dm" element={<ChatDm />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/profile/:username" element={<Profile />} />
			</Routes>
		</LangProvider>
	</BrowserRouter>,
);
