/**
 * Created by cghislai on 29/07/15.
 */
export enum Language {
    FRENCH,
    DUTCH,
    ENGLISH
}
export class LocalizedString {
    lang: string;
    text: string;

    constructor(language: Language, text: string) {
        this.lang = this.getLangString(language);
        this.text = text;
    }
    getLangString(language: Language) : string {
        switch (language) {
            case Language.DUTCH:
                return 'nl';
            case Language.ENGLISH:
                return 'en';
            case Language.FRENCH:
                return 'fr';
        }
        return 'fr';
    }
}

export class ApplicationService {
    appName: string;
    appVersion: string;
    pageName: string;
    language: Language;
    companyId: number;

    constructor(){
        this.language = Language.FRENCH;
        this.companyId = 0;
    }
}