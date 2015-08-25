/**
 * Created by cghislai on 04/08/15.
 */

import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {CountryRef} from 'client/domain/country';

export class Company {
    id: number;
    name: LocaleTexts;
    description: LocaleTexts;
    countryRef: CountryRef;
}

export class CompanyRef {
    link: string;
    id: number;
}

export class CompanyFactory {
    static fromJSONCompanyReviver=(key,value)=>{
      if (key == 'name' || key == "description") {
          return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
      }
        return value;
    };
}