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
		Friend_online: string;
	};
	navbar: {
		search: string;
		add: string;
		pending: string;
		block: string;
	};
	Chat_page: {
		input: string;
	};
	Stat_page: {
		invite: string;
		message: string;
		blocked: string;
		stats: string;
		nb_game: string;
		win_rate: string;
		lose_game: string;
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