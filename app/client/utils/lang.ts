/**
 * Created by cghislai on 08/08/15.
 */

import {LocaleText, LocaleTextFactory} from '../domain/lang';

import * as Immutable from 'immutable';

export class LocaleTexts  {
    get(key:string): string {
        if (this.hasOwnProperty(key)) {
            return this[key];
        }
        return null;
    }
    set(key: string, value:string) {
        this[key] = value;
        return this;
    }
}

export class LocaleTextsFactory {
    static fromLocaleTextArrayReviver = (jsonArray)=> {
        var localeTexts:LocaleTexts = new LocaleTexts();
        for (var localeText of jsonArray) {
            var lang = localeText.locale;
            var text = localeText.text;
            localeTexts[lang] = text;
        }
        return localeTexts;
    };

    static toJSONArrayLocaleTextsTransformer = (texts:any)=> {
        var textArray:any[] = Immutable.Map(texts)
            .filter((value, key)=> {
                return key != '_isLocalTexts';
            })
            .reduce((textArray, value, key)=> {
                var lang = key;
                var text = value;
                var localText = {
                    locale: lang,
                    text: text
                };
                textArray.push(localText);
                return textArray;
            }, []);
        return textArray;
    };

    static toLocaleTexts(text:any):LocaleTexts {
        var localeTexts: LocaleTexts = new LocaleTexts();
        for (var key in text) {
            localeTexts[key] = text[key];
        }
        return localeTexts;
    }
}


export interface Language extends Immutable.Map<string, any> {
    locale: string;
    label: LocaleTexts;
}
var LanguageRecord = Immutable.Record({
    locale: null,
    label: null
});
export function NewLanguage(desc:any):Language {
    return <any>LanguageRecord(desc);
}

export class LanguageFactory {
    static FRENCH = LanguageFactory.toLanguage('fr', LocaleTextsFactory.toLocaleTexts({'fr': 'Français'}));
    static DUTCH = LanguageFactory.toLanguage('nl', LocaleTextsFactory.toLocaleTexts({'fr': 'Néerlandais'}));
    static ENGLISH = LanguageFactory.toLanguage('en', LocaleTextsFactory.toLocaleTexts({'fr': 'Anglais'}));

    static ALL_LANGUAGES:Immutable.List<Language> = Immutable.List.of(LanguageFactory.FRENCH, LanguageFactory.DUTCH, LanguageFactory.ENGLISH);
    static DEFAULT_LANGUAGE = LanguageFactory.FRENCH;

    public locale:string;
    public label:LocaleTexts;

    constructor(code:string, labelMap:LocaleTexts) {
        this.locale = code;
        this.label = labelMap;
    }

    static fromLocale(lang:string):Language {
        var language = LanguageFactory.ALL_LANGUAGES
            .filter((language)=> {
                return language.locale === lang;
            })
            .first();
        return language;
    }

    static toLanguage(locale:string, label:LocaleTexts) {
        var desc:any = {locale: locale, label: label};
        return NewLanguage(desc);
    }
}
