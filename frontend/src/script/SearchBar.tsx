import { useState } from 'react';
import { useLang } from './langProvider';

export default function SearchBar() {
	const lang = useLang().getLang();
	const [query, setQuery] = useState("");
	const [error, setError] = useState("");
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!query.trim() || !isUser(query))
		{
			setError("Cannot find user");
			return;
		}
		setError("");
		window.location.href = `/profile/${query}`
	};
		return (
			<>
				<form onSubmit={handleSubmit} aria-label="Search user form">
					<input
						aria-label="Search user"
						type="text"
						placeholder={lang.navbar.search}
						value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="main-search-form-input"
				/>
				{error && <p className="main-search-error">{error}</p>}
			</form>
		</>
	);
}