export async function verifToken(token: string): Promise<boolean> {
	try {
		const res = await fetch('/api/db/checktoken', {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}` 
			}
		});
		
		if (res.ok) {
			const data = await res.json();
			return data.success === true;
		}
		return false;
	} catch (error) {
		console.error("Erreur lors de la vérification du token:", error);
		return false;
	}
}