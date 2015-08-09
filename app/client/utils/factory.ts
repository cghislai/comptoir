/**
 * Created by cghislai on 09/08/15.
 */
import {LocaleTextsFactory} from 'client/utils/lang';


export class JSONFactory {
    static replacers=  {
        'LocaleTexts':LocaleTextsFactory.toJSONLocaleTextsReplacer
    };

    static toJSONReplacer(key: string, value: any) : string {
        var valueType = typeof value;
        var replacer = this.replacers[valueType];
        if (replacer == undefined) {
            return value;
        }
        return replacer(value);
    }
}