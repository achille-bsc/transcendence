import enGBData from '../language/en.json';
import frFRData from '../language/fr.json';
import deDEData from '../language/de.json';


// Interface for translations
export interface Translations {
	Log_register_page: {
		login: string;
		register: string;
		pseudo: string;
		password: string;
		confirm_password: string;
		submit: string;
		email: string;
		pseudo_email: string;
	},
	Home_page: {
		game_name: string;
		play: string;
		friend: string;
	};
	navbar: {
		search: string;
		add: string;
		pending: string;
		block: string;
		profile: string;
		settings: string;
		deconnexion: string;
		terms_of_services: string;
		users_not_found: string;
	};
	Chat_page: {
		input: string;
	};
	Game_page: {
		creation_partie: string;
		rejoindre_partie: string;
		easy: string;
		medium: string;
		hard: string;
		online: string;
		local: string;
		disconnect: string;
		tentative: string;
		reconnect: string
	};
	Alt_text: {
		menu_icon: string;
		friend_icon: string;
		game_icon: string;
		language_icon: string;
		dm_icon: string;
		profile_icon: string;
		profile_picture: string;
		friend_request_accept: string;
		friend_request_reject: string;
		github_logo: string;
		send_logo: string;
	};
	Profile_page: {
		edit_profile: string;
		add_friend: string;
		remove_friend: string;
		message: string;
		member_since: string;
		pseudo: string;
	};
	Settings_page: {
		pseudo: string;
		password: string;
		email: string;
		api: string;
		edit: string;
		generate: string;
	},
	not_found: {
		title: string;
		message: string;
		home_button: string;
	},
	Terms_page: {
		title: string;
		last_updated: string;
		terms_1: string;
		terms_1_0: string;
		terms_1_1: string;
		terms_2: string;
		terms_2_0: string;
		terms_2_1: string;
		terms_2_2: string;
		terms_2_3: string;
		terms_2_4: string;
		terms_2_5: string;
		terms_2_6: string;
		terms_3: string;
		terms_3_0: string;
		terms_3_1: string;
		terms_3_2: string;
		terms_3_3: string;
		terms_3_4: string;
		terms_3_5: string;
		terms_3_6: string;
		terms_3_7: string;
		terms_3_8: string;
		terms_3_9: string;
		terms_4: string;
		terms_4_0: string;
		terms_4_1: string;
		terms_5: string;
		terms_5_0: string;
		terms_6: string;
		terms_6_0: string;
		terms_6_1: string;
		terms_6_2: string;
		terms_6_3: string;
		terms_6_4: string;
		terms_7: string;
		terms_7_0: string;
		terms_8: string;
		terms_8_0: string;
		terms_8_1: string;
		terms_8_2: string;
		terms_8_3: string;
		terms_8_4: string;
		terms_9: string;
		terms_9_0: string;
		terms_9_1: string;
		terms_10: string;
		terms_10_0: string;
		terms_10_1: string;
		terms_11: string;
		terms_11_0: string;
		terms_12: string;
		terms_12_0: string;
		terms_12_1: string;
		terms_13: string;
		terms_13_0: string;
		terms_14: string;
		terms_14_0: string;
		terms_15: string;
		terms_15_0: string;
		terms_15_1: string;
		terms_15_2: string;
	}
}
// Load translations based on language
export function getLanguageData(lang: string): Translations {
	switch (lang) {
		case 'fr':
			return (frFRData.translations as Translations);
		case 'de':
			return (deDEData.translations as Translations);
		case 'en':
			return (enGBData.translations as Translations);
		default:
			return (enGBData.translations as Translations);
	}
}

export function useTranslations(): Translations {
	return getLanguageData(localStorage.getItem('language') as string);
}