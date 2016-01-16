/**
 * Created by cghislai on 04/08/15.
 */

import {LocaleTexts, LocaleTextsFactory} from '../utils/lang';
import {CountryRef} from './country';
import {ComptoirRequest} from '../utils/request';


export class Company {
    id: number;
    name: LocaleTexts;
    description: LocaleTexts;
    countryRef: CountryRef;
}

export class CompanyRef {
    link: string;
    id: number;
    constructor(id?: number) {
        this.id = id;
    }
}

export class CompanyFactory {
    static fromJSONReviver=(key,value)=>{
      if (key ==='name' || key ==="description") {
          return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
      }
        return value;
    };

}