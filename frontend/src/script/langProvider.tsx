import React, { createContext, useContext, useState } from 'react';
import {useTranslations, type Translations} from "./local"

const LangContext = createContext<LangContextType | undefined>(undefined);


type LangContextType = {
	getLang: () => Translations; // marks as logged in
	setLang: (Lang :string) => void; // updates the user profile
};


export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

	const [tr, setTr] = useState(useTranslations());
	const t = (tr as Translations);

	function setLang(Lang : string) {
		console.log(Lang);
		if (Lang === "en") 
			localStorage.setItem("language", "en");
		if (Lang === "fr")
			localStorage.setItem("language", "fr");
		if (Lang === "de")
			localStorage.setItem("language", "de");
		setTr(useTranslations())
	}

	function getLang() {
		return (t);
	}

	return <LangContext.Provider value={{setLang, getLang}}>{children}</LangContext.Provider>;
};

export const useLang = (): LangContextType => {
	const ctx = useContext(LangContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
};
