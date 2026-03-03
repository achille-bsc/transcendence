import Button from "./TryButton.tsx";
import { useLang } from './script/langProvider';
import Main from './utils/Main.tsx';
import Bottombar from "./script/Bottombar.tsx";

function Home () {
	if (!localStorage.getItem("token")) {
		window.location.href = "/log";
		return;
	}
	const lang = useLang().getLang();

	return (
		<div className="quantico-regular home-root">
			<Main>
				<div className="home-center">
					<div className="home-content">
						<div className="home-hero">
							<p className="home-title">{lang.Home_page.game_name}</p>
							<div className="home-play-wrap">
								<Button
									className="home-play-btn"
									onClick={() => window.location.href = "/game"}
									label={lang.Home_page.play}
									/>
							</div>
						</div>
						<p className="home-footer">{lang.Home_page.friend}</p>
						{/* <Bottombar className="home-bottombar" /> */}
					</div>
				</div>
			</Main>
		</div>
	);
}

export default Home
