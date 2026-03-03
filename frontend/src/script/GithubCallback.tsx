import { useEffect } from "react";

export default function GithubCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) return;

    async function exchange() {
        try {
            const res = await fetch("/api/db/oauth/github/callback?code="+ code, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            localStorage.setItem("token", data.access_token);
            console.log(data);
            //call register here
            if (!data.access_token) {
                console.error("No token returned from backend");
                return;
            }
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
