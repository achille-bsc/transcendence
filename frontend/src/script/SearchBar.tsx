import { useState } from 'react';
import { useLang } from './langProvider';

async function isUser(username: string): Promise<boolean> {
	const token = localStorage.getItem("token");
	if (!token) {
		return false;
	}

	try {
		const res = await fetch('/user/profileother', {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body : JSON.stringify({ pseudo: username })
		});

		const data = await res.json();
		if (data.success === false)
			return false;
		return data?.user?.pseudo === username;
	} catch (err) {
		console.log("Error checking user:", err);
		return false;
	}
}

export default function SearchBar() {
	const lang = useLang().getLang();
	const [query, setQuery] = useState("");
	const [error, setError] = useState("");
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!query.trim() || !(await isUser(query)))
		{
			setError(lang.Feedback.cannot_find_user);
			return;
		}
		setError("");
		window.location.href = `/profile/${query}`
	};
		return (
			<div>
				<form onSubmit={handleSubmit} aria-label={lang.Feedback.search_user_form_aria}>
					<input
						aria-label={lang.Feedback.search_user_input_aria}
						type="text"
						placeholder={lang.navbar.search}
						value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="main-search-form-input"
				/>
				{error && <p className="main-search-error">{error}</p>}
			</form>
		</div>
	);
}