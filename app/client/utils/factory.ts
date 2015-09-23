/**
 * Created by cghislai on 09/08/15.
 */
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {AccountType, AccountFactory} from 'client/domain/account';

export class JSONFactory {
    static toJSONReplacer(key:string, value:any):any {
        if (value instanceof LocaleTexts) {
            var localeTextArray = LocaleTextsFactory.toJSONArrayLocaleTextsTransformer(value);
            return localeTextArray;
        }
        return value;
    }
}