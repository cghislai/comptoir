/**
 * Created by cghislai on 09/08/15.
 */

import {LocaleTexts, LocaleTextsFactory} from './lang';

export class JSONFactory {
    static toJSONReplacer(key:string, value:any):any {
        if (value !== undefined && value != null && value instanceof LocaleTexts) {
            var localeTextArray = LocaleTextsFactory.toJSONArrayLocaleTextsTransformer(value);
            return localeTextArray;
        }
        return value;
    }
}