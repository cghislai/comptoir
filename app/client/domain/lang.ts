/**
 * Created by cghislai on 05/08/15.
 */

export class LocaleText {
    id: number;
    localeTextMap: {[locale: string]: string};
}

export class LocaleTextFactory {
    static getLocaleTextFromJSON(jsonObject: any) : LocaleText {
        if (jsonObject === undefined) {
            return undefined;
        }
        var localeText = new LocaleText();
        localeText.id = jsonObject.id;
        localeText.localeTextMap = {};

        if (jsonObject.hasOwnProperty('localeTextMap')) {
            var jsonMap = jsonObject.localeTextMap;
           for (var lang in jsonMap) {
               localeText.localeTextMap[lang] = jsonMap[lang];
           }
        }
        return localeText;
    }
}