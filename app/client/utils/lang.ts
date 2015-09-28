/**
 * Created by cghislai on 08/08/15.
 */

import {LocaleText, LocaleTextFactory} from 'client/domain/lang';

import {Map, List} from 'immutable';

export interface LocaleTexts extends Map<string, any> {
    // field used in the client/utils/factory JSONreplacer
    _isLocalTexts: boolean;
}

export class LocaleTextsFactory {
    static fromLocaleTextArrayReviver = (jsonArray)=> {
        var localeTextsDesc:any = {};
        for (var localeText of jsonArray) {
            var lang = localeText.locale;
            var text = localeText.text;
            localeTextsDesc[lang] = text;
        }
        var localeTexts:LocaleTexts;
        localeTexts = <LocaleTexts>Map(localeTextsDesc);
        return localeTexts;
    };

    static toJSONArrayLocaleTextsTransformer = (texts:LocaleTexts)=> {
        var textArray = texts.entrySeq()
            .reduce((textArray, value)=> {
                var lang = value[0];
                var text = value[1];
                var localText = {
                    locale: lang,
                    text: text
                };
                textArray.push(localText);
                return textArray;
            }, []);
        return textArray;
    };

    static toLocaleTexts(text?:any):LocaleTexts {
        text._isLocalTexts = true;
        return <LocaleTexts>Map(text);
    }
}


export interface Language extends Map<string, any> {
    locale:string;
    label: LocaleTexts;
}

export class LanguageFactory {
    static FRENCH = LanguageFactory.toLanguage('fr', LocaleTextsFactory.toLocaleTexts({'fr': 'Français'}));
    static DUTCH = LanguageFactory.toLanguage('nl', LocaleTextsFactory.toLocaleTexts({'fr': 'Néerlandais'}));
    static ENGLISH = LanguageFactory.toLanguage('en', LocaleTextsFactory.toLocaleTexts({'fr': 'Anglais'}));

    static ALL_LANGUAGES = List.of(LanguageFactory.FRENCH, LanguageFactory.DUTCH, LanguageFactory.ENGLISH);
    static DEFAULT_LANGUAGE = LanguageFactory.FRENCH;

    public locale:string;
    public label:LocaleTexts;

    constructor(code:string, labelMap:LocaleTexts) {
        this.locale = code;
        this.label = labelMap;
    }

    static fromLocale(lang:string):Language {
        var language = LanguageFactory.ALL_LANGUAGES.valueSeq()
            .filter((language)=> {
                return language.locale == lang;
            })
            .first();
        return language;
    }

    static toLanguage(locale:string, label:LocaleTexts) {
        var desc:any = {locale: locale, label: label};
        return <Language>Map(desc);
    }
}
