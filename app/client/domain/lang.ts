/**
 * Created by cghislai on 05/08/15.
 */

export class LocaleText {
    locale:  string;
    text: string;
}

export class LocaleTextFactory {

    static getLocaleTextFromJSON(jsonObject: any) : LocaleText {
        if (jsonObject === undefined) {
            return undefined;
        }
        var localeText = new LocaleText();
        localeText.text = jsonObject.text;
        localeText.locale = jsonObject.locale;
        return localeText;
    }
    static getLocaleTextArrayFromJSON(jsonObject: any) : LocaleText[] {
        if (jsonObject === undefined) {
            return undefined;
        }
        var localeTexts=[];
        for (var localeTextJSON of jsonObject) {
            var localetext = LocaleTextFactory.getLocaleTextFromJSON(localeTextJSON);
            localeTexts.push(localetext);
        }
        return localeTexts;
    }
}