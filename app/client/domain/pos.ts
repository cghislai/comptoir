/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {CustomerRef} from 'client/domain/customer';
import {LocaleTexts,LocaleTextsFactory} from 'client/utils/lang';

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

// TODO: PosWithClient ala PicturedItem

export class PosFactory {
    static fromJSONPosReviver = (key, value)=> {
        if (key == 'description') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }

}