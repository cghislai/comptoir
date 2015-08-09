/**
 * Created by cghislai on 04/08/15.
 */

import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';

export class Company {
    id: number;
    name: LocaleTexts;
    description: LocaleTexts;
}

export class CompanyRef {
    link: string;
    id: number;
}

export class CompanyFactory {
    static fromJSONCompanyReviver=(key,value)=>{
      if (key == 'name' || key == "description") {
          return JSON.parse(value, LocaleTextsFactory.fromJSONLocaleTextsReviver);
      }
        return value;
    };
}