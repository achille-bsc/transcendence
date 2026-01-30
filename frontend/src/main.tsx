// import React from "react";
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter as Router, Routes, Route } from "react-router";
//import './index.css'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

const root = document.getElementById("root");

import Home from './Home.tsx'
import Register from './Register.tsx'
import Log from './Log.tsx'
import Chat from './Chat.tsx'
// import Button from './Button.tsx'
import Try from './Try.tsx'

ReactDOM.createRoot(root!).render(
	<BrowserRouter>
		<Routes>
			<Route path="/try" element={<Try />} />
			<Route path="/" element={<Home />} />
			<Route path="/log" element={<Log />} />
			<Route path="/register" element={<Register />} />
			<Route path="/chat" element={<Chat />} />
		</Routes>
	</BrowserRouter>,
);
