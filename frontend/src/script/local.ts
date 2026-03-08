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
	};
	Chat_page: {
		input: string;
	};
	Game_page: {
		description: string;
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
	return getLanguageData(localStorage.getItem("language") as string);
}