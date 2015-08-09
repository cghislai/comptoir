/**
 * Created by cghislai on 04/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {Pagination} from 'client/utils/pagination';

export enum AccountType {
    PAYMENT,
    VAT,
    OTHER
}

export class Account {
    id: number;
    company: CompanyRef;
    accountingNumber: string;
    iban: string;
    bic: string;
    name: string;
    description: LocaleTexts;
    accountType: AccountType;
}

export class AccountRef {
    id: number;
    link: string;
}

export class AccountSearch {
    companyRef: CompanyRef;
    pagination: Pagination;
}


export class AccountFactory {

    static fromJSONAccountReviver = (key, value)=>{
        if (key == 'description') {
            return JSON.parse(value, LocaleTextsFactory.fromJSONLocaleTextsReviver);
        }
        if (key == 'accountType') {
            return AccountFactory.getAccountTypeFromString(value);
        }
        return value;
    }

    static getAccountTypeFromString(type: string) : AccountType {
        if (type === undefined) {
            return undefined;
        }
        if (type == 'PAYMENT') {
            return AccountType.PAYMENT;
        }
        if (type == 'VAR') {
            return AccountType.VAT;
        }
        if (type == 'OTHER') {
            return AccountType.OTHER;
        }
        return undefined;
    }
}