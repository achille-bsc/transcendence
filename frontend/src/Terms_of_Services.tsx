import Main from "./utils/Main.tsx";
import { useLang } from "./script/langProvider.tsx";

export default function Terms_of_Services() {
	const lang = useLang().getLang();

	return (
		<Main>
			<div className="bg-[var(--background-box-select)] border border-solid border-1 border-t-0 border-b-0 border-[var(--default)] overflow-y-auto flex flex-col items-start h-[calc(93vh-20px)] text-[var(--contrast)] overflow-x-hidden px-8 py-6 max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-6">{lang.Terms_page.title}</h1>
				<p className="mb-4 text-sm text-gray-400">{lang.Terms_page.last_updated}</p>
				
				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Terms_page.terms_1}</h2>
					<p className="mb-3">
						{lang.Terms_page.terms_1_0}
					</p>
					<p className="mb-3">
						{lang.Terms_page.terms_1_1}
					</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Terms_page.terms_2}</h2>
					<p className="mb-3">
						{lang.Terms_page.terms_2_0}
					</p>
					<ul className="list-disc ml-6 mb-3 space-y-1">
						<li>{lang.Terms_page.terms_2_1}</li>
						<li>{lang.Terms_page.terms_2_2}</li>
						<li>{lang.Terms_page.terms_2_3}</li>
						<li>{lang.Terms_page.terms_2_4}</li>
						<li>{lang.Terms_page.terms_2_5}</li>
					</ul>
					<p className="mb-3">
						{lang.Terms_page.terms_2_6}
					</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Terms_page.terms_3}</h2>
					<p className="mb-3">
						{lang.Terms_page.terms_3_0}
					</p>
					<ul className="list-disc ml-6 mb-3 space-y-1">
						<li>{lang.Terms_page.terms_3_1}</li>
						<li>{lang.Terms_page.terms_3_2}</li>
						<li>{lang.Terms_page.terms_3_3}</li>
						<li>{lang.Terms_page.terms_3_4}</li>
						<li>{lang.Terms_page.terms_3_5}</li>
						<li>{lang.Terms_page.terms_3_6}</li>
						<li>{lang.Terms_page.terms_3_7}</li>
						<li>{lang.Terms_page.terms_3_8}</li>
						<li>{lang.Terms_page.terms_3_9}</li>
					</ul>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Terms_page.terms_4}</h2>
					<p className="mb-3">
						{lang.Terms_page.terms_4_0}
					</p>
					<p className="mb-3">
						{lang.Terms_page.terms_4_1}
					</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Terms_page.terms_5}</h2>
					<p className="mb-3">
						{lang.Terms_page.terms_5_0}
					</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Terms_page.terms_6}</h2>
					<p className="mb-3">
						{lang.Terms_page.terms_6_0}
					</p>
					<ul className="list-disc ml-6 mb-3 space-y-1">
						<li>{lang.Terms_page.terms_6_1}</li>
						<li>{lang.Terms_page.terms_6_2}</li>
						<li>{lang.Terms_page.terms_6_3}</li>
						<li>{lang.Terms_page.terms_6_4}</li>
					</ul>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Terms_page.terms_7}</h2>
					<p className="mb-3">
						{lang.Terms_page.terms_7_0}
					</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Terms_page.terms_8}</h2>
					<p className="mb-3">
						{lang.Terms_page.terms_8_0}
					</p>
					<ul className="list-disc ml-6 mb-3 space-y-1">
						<li>{lang.Terms_page.terms_8_1}</li>
						<li>{lang.Terms_page.terms_8_2}</li>
						<li>{lang.Terms_page.terms_8_3}</li>
					</ul>
					<p className="mb-3">
						{lang.Terms_page.terms_8_4}
					</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Terms_page.terms_9}</h2>
					<p className="mb-3">
						{lang.Terms_page.terms_9_0}
					</p>
					<p className="mb-3">
						{lang.Terms_page.terms_9_1}
					</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Terms_page.terms_10}</h2>
					<p className="mb-3">
						{lang.Terms_page.terms_10_0}
					</p>
					<p className="mb-3">
						{lang.Terms_page.terms_10_1}
					</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Terms_page.terms_11}</h2>
					<p className="mb-3">
						{lang.Terms_page.terms_11_0}
					</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Terms_page.terms_12}</h2>
					<p className="mb-3">
						{lang.Terms_page.terms_12_0}
					</p>
					<p className="mb-3">
						{lang.Terms_page.terms_12_1}
					</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Terms_page.terms_13}</h2>
					<p className="mb-3">
						{lang.Terms_page.terms_13_0}
					</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Terms_page.terms_14}</h2>
					<p className="mb-3">
						{lang.Terms_page.terms_14_0}
					</p>
				</section>

				<section className="mb-6">
					<h2 className="text-2xl font-semibold mb-3">{lang.Terms_page.terms_15}</h2>
					<p className="mb-3">
						{lang.Terms_page.terms_15_0}
					</p>
					<p className="mb-3">
						{lang.Terms_page.terms_15_1}
					</p>
				</section>

				<section className="mb-6">
					<p className="text-sm text-gray-400">
						{lang.Terms_page.terms_15_2}
					</p>
				</section>
			</div>
		</Main>
	);
}