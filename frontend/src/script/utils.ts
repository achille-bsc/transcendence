export async function verifToken(token: string): Promise<boolean>
{
	const res = await fetch("http://localhost:7979/login", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			token: token
		}),
	});
	
	const data = await res.json();

	if (!res.ok) {
		return (data.success as boolean);
	}
	return false;
}
