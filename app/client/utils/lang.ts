/**
 * Created by cghislai on 08/08/15.
 */

import {LocaleText, LocaleTextFactory} from 'client/domain/lang';
// localeText[lang]=text
export class LocaleTexts {
}

export class LocaleTextsFactory {
    static toJSONLocaleTextsReplacer = (value:LocaleTexts)=> {
        if (value == undefined) {
            return undefined;
        }
        var texts = [];
        for (var lang in value) {
            var text = value[lang];
            var localeText = new LocaleText();
            localeText.locale = lang;
            localeText.text = text;

        }
        return texts;
    }

    // json = [{locale:string,text:string},{}]
    static fromJSONLocaleTextsReviver = (key, value)=> {
        if (key != '') {
            // an array entry
            return JSON.parse(value, LocaleTextFactory.fromJSONLocaleTextReviver);
        }
        // The main object
        // Convert the array to a LocaleTexts;
        var localeTexts = new LocaleTexts();
        for (var localeText of value) {
            var lang = localeText.locale;
            var text = localeText.text;
            localeTexts[lang] = text;
        }
        return localeTexts;
    }

    static fromLocaleTextArrayReviver = (jsonArray)=>{
        var localeTexts = new LocaleTexts();
        for (var localeText of jsonArray) {
            var lang = localeText.locale;
            var text = localeText.text;
            localeTexts[lang] = text;
        }
        return localeTexts;
    }
}


export class Language {
    static FRENCH = new Language('fr', {'fr': 'Français'});
    static DUTCH = new Language('nl', {'fr': 'Néerlandais'});
    static ENGLISH = new Language('en', {'fr': 'Anglais'});

    static ALL_LANGUAGES = [Language.FRENCH, Language.DUTCH, Language.ENGLISH];
    static DEFAULT_LANGUAGE = Language.FRENCH;

    public locale:string;
    public label:{[locale: string] : string};

    constructor(code:string, labelMap:any) {
        this.locale = code;
        this.label = labelMap;
    }

    static fromLanguage(lang:string):Language {
        for (var language of Language.ALL_LANGUAGES) {
            if (language.locale == lang) {
                return language
            }
        }
        return undefined;
    }
}
