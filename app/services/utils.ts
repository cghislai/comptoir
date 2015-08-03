/**
 * Created by cghislai on 02/08/15.
 */

export class Pagination {
    pageIndex: number;
    firstIndex: number;
    pageSize: number;

    constructor();
    constructor(firstIndex: number, pageSize: number);
    constructor(firstIndex?: number, pageSize?: number) {
        if (firstIndex != undefined) {
            this.firstIndex = firstIndex;
        }
        if (pageSize != undefined) {
            this.pageSize = pageSize;
        }
    }
}

export enum Language {
    FRENCH,
    DUTCH,
    ENGLISH
}


export class LocaleText {
    static DEFAULT_LANGUAGE: Language =Language.FRENCH;

    id: number;
    localeTextMap={};
    lang: string;
    text: string;

    constructor();
    constructor(language: Language, text: string);
    constructor(language?: Language, text?: string) {
        if (language != undefined && text != undefined) {
            var locale = LocaleText.getLocale(language);
            this.localeTextMap[locale] = text;
        }
    }

    get();
    get(language: Language);
    get(language?: Language) {
        if (language == undefined) {
            for (var lang in this.localeTextMap) {
                language = lang;
                break;
            }
        }
        var locale = LocaleText.getLocale(language);
        return this.localeTextMap[locale];
    }
    set(language: Language, text: string) {
        var locale = LocaleText.getLocale(language);
        this.localeTextMap[locale] = text;
    }


    static getLocale(language: Language) : string {
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