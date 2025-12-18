export async function generateToken() {
	let token = ""; 
	for (var i =0;i < 16; i++) 
		token += Math.random().toString(16).substring(2);
	console.log("Generated token:", token);
	return token
}