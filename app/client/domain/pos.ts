/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from './company';
import {CustomerRef} from './customer';
import {LocaleTexts,LocaleTextsFactory} from '../utils/lang';


export class Pos {
    id:number;
    companyRef:CompanyRef;
    name:string;
    description:LocaleTexts;
    defaultCustomerRef:CustomerRef;
}

export class PosRef {
    id:number;
    link:string;

    constructor(id?:number) {
        this.id = id;
    }
}

export class PosSearch {
    companyRef:CompanyRef;
}

export class PosFactory {
    static fromJSONReviver = (key, value)=> {
        if (key ==='description') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }

}