export async function verifToken(token: string): Promise<boolean>
{
	const res = await fetch('/api/db/login', {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			token: token
		}),
	});
	
	const data = await res.json();

	if (res.ok) {
		return (data.success as boolean);
	}
	return false;
}
