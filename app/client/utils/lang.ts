/**
 * Created by cghislai on 08/08/15.
 */

import {LocaleText, LocaleTextFactory} from 'client/domain/lang';
// localeText[lang]=text
export class LocaleTexts {
}

export class LocaleTextsFactory {
    static getLocaleTextsFromTextArray(texts: LocaleText[]):LocaleTexts {
        if (texts == undefined) {
            return {};
        }
        var localeTexts = new LocaleTexts();
        for (var text of texts) {
            localeTexts[text.locale] = text.text;
        }
        return localeTexts;
    }

    static getLocaleTextsJSON(localeTexts: LocaleTexts) : string {
        if (localeTexts == undefined) {
            return undefined;
        }
        var texts = [];
        for (var lang in localeTexts) {
            var text = localeTexts[lang];
            var localeText = new LocaleText();
            localeText.locale = lang;
            localeText.text = text;

        }
        return JSON.stringify(texts);
    }
}



export class Language {
    static FRENCH = new Language('fr', {'fr':'Français'});
    static DUTCH = new Language('nl', {'fr':'Néerlandais'});
    static ENGLISH = new Language('en', {'fr': 'Anglais'});

    static ALL_LANGUAGES = [Language.FRENCH, Language.DUTCH, Language.ENGLISH];
    static DEFAULT_LANGUAGE = Language.FRENCH;

    public locale: string;
    public label: {[locale: string] : string};

    constructor(code: string, labelMap: any) {
        this.locale = code;
        this.label = labelMap;
    }
    static fromLanguage(lang: string): Language {
        for (var language of Language.ALL_LANGUAGES) {
            if (language.locale == lang) {
                return language
            }
        }
        return undefined;
    }
}
