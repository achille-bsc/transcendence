import enGBData from '../language/en.json';
import frFRData from '../language/fr.json';
import deDEData from '../language/de.json';


// Interface for translations
export interface Translations {
    navigation: {
        home: string;
        game: string;
        chat: string;
        leaderboard: string;
        friends: string;
        profile: string;
        settings: string;
    };
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