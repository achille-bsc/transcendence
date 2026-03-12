// import Button from "./TryButton.tsx";
// import { useState } from "react";
// import { useLang } from './script/langProvider';
// import { verifToken } from './script/utils';
// import Main from './utils/Main.tsx';

// export default function Game () {
// 	let isAuth = false;
// 	const token = localStorage.getItem('token')
// 	if (token)
// 	{
// 		if (!verifToken(token))
// 		{
// 			window.location.href = "/log";
// 		}
// 		else
// 		{
// 				isAuth = true;
// 		}
// 	}
// 	else
// 		window.location.href = "/log";
// 	const lang = useLang().getLang();
// 	const [i, setI] = useState(0);

	
// 	return (
// 		<div className="quantico-regular">
// 			<Main>
// 				<div className="game-content">
// 					{lang.Game_page.description} <br />
// 					<button 
// 						className="game-counter-btn" 
// 						onClick={() => setI(i + 1)}>nb: {i}
// 					</button>
// 				</div>
// 			</Main>
// 		</div>
// 	);
// }









import { verifToken } from './script/utils';
import Main from './utils/Main.tsx';
import { KongGameComponent } from './utils/gameWrapper.tsx';
import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from './script/langProvider';
import Img from './utils/Img.tsx';
import full from '../icons/full.png';

async function getUsername()
{
	try
	{
		const token = localStorage.getItem("token");
		if (!token) {
			console.log("Token not found");
			return false;
		}
		const res = await fetch('/user/profile', {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}` 
			}
		});
		const data = await res.json();
		if (data.success === false || !data.user)
			return false;
		return data.user.pseudo;
	}
	catch (error)
	{
		console.log("Invalid token:", error);
		return false;
	}
}


export default function Game() {
	const token = localStorage.getItem('token');
	const lang = useLang().getLang();
	const gameTranslations = useMemo(() => ({
		createButton: lang.Game_page.creation_partie,
		joinButton: lang.Game_page.rejoindre_partie,
		connecting: lang.Game_page.connecting,
		connectedAuthenticating: lang.Game_page.connected_authenticating,
		authenticated: lang.Game_page.authenticated,
		gameCreated: lang.Game_page.game_created,
		gameJoined: lang.Game_page.joined,
		disconnected: lang.Game_page.disconnected_status,
		reconnecting: lang.Game_page.reconnecting_status,
		reconnectFailed: lang.Game_page.reconnect_failed,
		waitingPlayers: lang.Game_page.waiting_players,
		disconnectedFromServer: lang.Game_page.disconnected_server,
		attemptingReconnect: lang.Game_page.attempting_reconnect,
		victoryTitle: lang.Game_page.victory_title,
		playerWon: lang.Game_page.player_won,
		playAgain: lang.Game_page.play_again,
	}), [lang]);
	const [loggedUser, setLoggedUser] = useState<string | null>(null);
	const gameContainerRef = useRef<HTMLDivElement>(null);
	
	if (!token || !verifToken(token)) {
		window.location.href = "/log";
		return null;
	}
	
	useEffect(() => {
		async function fetchUsername() {
			const name = await getUsername();
			setLoggedUser(name);
		}
		fetchUsername();
	}, []);
	
	console.log("loggedUser:", loggedUser);
	useEffect(() => {
		const BASE_WIDTH = 800;
		const BASE_HEIGHT = 600;

		const resizeGameDisplay = () => {
			const host = gameContainerRef.current;
			if (!host) return;

			const gameRoot = host.querySelector('.kong-game-container') as HTMLDivElement | null;
			const canvas = host.querySelector('.kong-canvas') as HTMLCanvasElement | null;
			const controls = host.querySelector('.kong-controls') as HTMLDivElement | null;
			const status = host.querySelector('.kong-status') as HTMLDivElement | null;
			if (!gameRoot || !canvas) return;

			const isFullscreen = document.fullscreenElement === host;
			if (isFullscreen) {
				host.style.width = '100vw';
				host.style.height = '100vh';
				host.style.display = 'flex';
				host.style.alignItems = 'center';
				host.style.justifyContent = 'center';
				host.style.overflow = 'hidden';
			} else {
				host.style.width = '';
				host.style.height = '';
				host.style.display = '';
				host.style.alignItems = '';
				host.style.justifyContent = '';
				host.style.overflow = '';
			}

			const availableWidth = isFullscreen
				? window.innerWidth - 24
				: (host.parentElement?.clientWidth ?? window.innerWidth) - 48;
			const availableHeight = isFullscreen
				? window.innerHeight - 24
				: (host.parentElement?.clientHeight ?? window.innerHeight) - 48;

			const uiHeight = (controls?.offsetHeight ?? 0) + (status?.offsetHeight ?? 0);
			const safeHeight = Math.max(120, availableHeight - uiHeight);

			const scale = Math.min(availableWidth / BASE_WIDTH, safeHeight / BASE_HEIGHT);
			const targetWidth = Math.max(320, Math.floor(BASE_WIDTH * scale));
			const targetHeight = Math.max(240, Math.floor(BASE_HEIGHT * scale));

			gameRoot.style.width = `${targetWidth}px`;
			canvas.style.width = `${targetWidth}px`;
			canvas.style.height = `${targetHeight}px`;
		};

		const rafId = requestAnimationFrame(resizeGameDisplay);
		window.addEventListener('resize', resizeGameDisplay);
		document.addEventListener('fullscreenchange', resizeGameDisplay);

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('resize', resizeGameDisplay);
			document.removeEventListener('fullscreenchange', resizeGameDisplay);
		};
	}, [loggedUser]);

	function toggleFullscreen() {
		const container = gameContainerRef.current;
		if (!container) return;

		const docWithWebkit = document as Document & {
			webkitExitFullscreen?: () => Promise<void>;
		};
		const elWithWebkit = container as HTMLDivElement & {
			webkitRequestFullscreen?: () => Promise<void>;
		};

		if (document.fullscreenElement) {
			if (document.exitFullscreen) {
				void document.exitFullscreen();
				return;
			}
			if (docWithWebkit.webkitExitFullscreen) {
				void docWithWebkit.webkitExitFullscreen();
			}
			return;
		}

		if (container.requestFullscreen) {
			void container.requestFullscreen();
			return;
		}
		if (elWithWebkit.webkitRequestFullscreen) {
			void elWithWebkit.webkitRequestFullscreen();
		}
	}

	return (
		<Main>
			<div className="h-[calc(100dvh-5rem)] overflow-auto flex justify-center items-center p-4">
				<div ref={gameContainerRef} className="my-auto max-w-full relative inline-block">
					<KongGameComponent
						wsUrl={`wss://${location.host}/kong/ws`}
						userToken={token}
						userId={loggedUser || ""}
						translations={gameTranslations}
						width={800}
						height={600}
						onConnected={() => {}}
						onError={(err) => console.log(lang.Feedback.game_error + ":", err)}
						/>
					<div className="absolute bottom-3 left-3 z-20">
							<button type="button" onClick={toggleFullscreen} aria-label={lang.Game_page.fullscreen_button} className="p-1 bg-black/20 hover:bg-black/35 transition-colors duration-150">
								<Img src={full} alt={lang.Alt_text.fullscreen_icon} className="w-8 h-8 cursor-pointer drop-shadow-md hover:scale-110 transition-transform duration-150" />
						</button>
					</div>
				</div>
			</div>
		</Main>
	);
}


