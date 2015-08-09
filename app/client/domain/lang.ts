/**
 * Created by cghislai on 05/08/15.
 */

export class LocaleText {
    locale:  string;
    text: string;
}

export class LocaleTextFactory {

    static fromJSONLocaleTextReviver = (key, value)=>{
        return value;
    }
}