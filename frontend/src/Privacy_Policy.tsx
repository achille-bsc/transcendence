import Main from "./utils/Main.tsx";
import { useLang } from "./script/langProvider.tsx";

export default function Privacy_Policy() {
	const lang = useLang().getLang();

	return (
		<Main>
			<div className="bg-[var(--background-box-select)] border border-solid border-1 border-t-0 border-b-0 border-[var(--default)] overflow-y-auto flex flex-col items-start h-[calc(93vh-20px)] text-[var(--contrast)] overflow-x-hidden px-8 py-6 max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-6">{lang.Privacy_page.title}</h1>
				<p className="mb-4 text-sm text-gray-400">{lang.Privacy_page.last_updated}</p>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Privacy_page.privacy_1}</h2>
					<p className="mb-3">{lang.Privacy_page.privacy_1_0}</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Privacy_page.privacy_2}</h2>
					<p className="mb-3">{lang.Privacy_page.privacy_2_0}</p>
					<ul className="list-disc ml-6 mb-3 space-y-1">
						<li>{lang.Privacy_page.privacy_2_1}</li>
						<li>{lang.Privacy_page.privacy_2_2}</li>
						<li>{lang.Privacy_page.privacy_2_3}</li>
						<li>{lang.Privacy_page.privacy_2_4}</li>
					</ul>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Privacy_page.privacy_3}</h2>
					<p className="mb-3">{lang.Privacy_page.privacy_3_0}</p>
					<ul className="list-disc ml-6 mb-3 space-y-1">
						<li>{lang.Privacy_page.privacy_3_1}</li>
						<li>{lang.Privacy_page.privacy_3_2}</li>
						<li>{lang.Privacy_page.privacy_3_3}</li>
					</ul>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Privacy_page.privacy_4}</h2>
					<p className="mb-3">{lang.Privacy_page.privacy_4_0}</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Privacy_page.privacy_5}</h2>
					<p className="mb-3">{lang.Privacy_page.privacy_5_0}</p>
					<ul className="list-disc ml-6 mb-3 space-y-1">
						<li>{lang.Privacy_page.privacy_5_1}</li>
						<li>{lang.Privacy_page.privacy_5_2}</li>
						<li>{lang.Privacy_page.privacy_5_3}</li>
					</ul>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Privacy_page.privacy_6}</h2>
					<p className="mb-3">{lang.Privacy_page.privacy_6_0}</p>
					<ul className="list-disc ml-6 mb-3 space-y-1">
						<li>{lang.Privacy_page.privacy_6_1}</li>
						<li>{lang.Privacy_page.privacy_6_2}</li>
					</ul>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Privacy_page.privacy_7}</h2>
					<p className="mb-3">{lang.Privacy_page.privacy_7_0}</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Privacy_page.privacy_8}</h2>
					<p className="mb-3">{lang.Privacy_page.privacy_8_0}</p>
					<ul className="list-disc ml-6 mb-3 space-y-1">
						<li>{lang.Privacy_page.privacy_8_1}</li>
						<li>{lang.Privacy_page.privacy_8_2}</li>
					</ul>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Privacy_page.privacy_9}</h2>
					<p className="mb-3">{lang.Privacy_page.privacy_9_0}</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Privacy_page.privacy_10}</h2>
					<p className="mb-3">{lang.Privacy_page.privacy_10_0}</p>
					<p className="mb-3">{lang.Privacy_page.privacy_10_1}</p>
				</section>
			</div>
		</Main>
	);
}