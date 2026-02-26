import { useEffect } from "react";

export default function GithubCallback() {
  useEffect(() => {
	const params = new URLSearchParams(window.location.search);
	const code = params.get("code");

	if (!code) return;

	async function exchange() {
		try {
			const res = await fetch(
			"http://localhost:3000/oauth/github/callback?code=" + code);
			const data = await res.json();
			localStorage.setItem("token", data.token);
			window.location.href = "/";
		}
		catch (err)
		{
			console.error("OAuth error", err);
		}
	}
	exchange();
	}, []);

	return <p>Connecting to github...</p>;
}