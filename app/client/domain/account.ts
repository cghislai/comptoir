/**
 * Created by cghislai on 04/08/15.
 */


import {CompanyRef} from './company';
import {PosRef} from './pos';
import {LocaleTexts, LocaleTextsFactory} from '../utils/lang';

export enum AccountType {
    PAYMENT,
    VAT,
    OTHER
}

export var ALL_ACCOUNT_TYPES:AccountType[] = [
    AccountType.OTHER,
    AccountType.PAYMENT,
    AccountType.VAT
];

export class Account {
    id:number;
    companyRef:CompanyRef;
    accountingNumber:string;
    iban:string;
    bic:string;
    name:string;
    description:LocaleTexts;
    accountType:string;
}

export class AccountRef {
    id:number;
    link:string;

    constructor(id?:number) {
        this.id = id;
    }
}

export class AccountSearch {
    companyRef:CompanyRef;
    posRef:PosRef;
    type:string;
}


export class AccountFactory {

    static fromJSONReviver = (key, value)=> {
        if (key === 'description') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }
}
