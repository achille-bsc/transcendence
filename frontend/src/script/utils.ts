import http, { ClientRequest } from "http";


export async function verifToken(token: string | null): Promise<boolean>
{
	if (!token)
		return (false);
	const req: ClientRequest  = http.request({
		hostname: 'database-service',
		port: '5000',
		path: '/checktoken',
		method: 'GET',
		headers: {
			'content': 'application/json',
			'content-length': token.length
		},
	}, (res: any) => {
		if (res.statusCode === 200)
			return (true);
		else
			return (false);
	})

	req.on('error', () => console.log("T'as fais de la merde ! cheh"));
	req.write(JSON.stringify(token));
	req.end();

	return (false);
}