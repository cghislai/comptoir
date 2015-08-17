/**
 * Created by cghislai on 04/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {PosRef} from 'client/domain/pos';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';

export enum AccountType {
    PAYMENT,
    VAT,
    OTHER
}

export class Account {
    id: number;
    companyRef: CompanyRef;
    accountingNumber: string;
    iban: string;
    bic: string;
    name: string;
    description: LocaleTexts;
    accountType: string;
}

export class AccountRef {
    id: number;
    link: string;
    constructor(id?:number) {
        this.id = id;
    }
}

export class AccountSearch {
    companyRef: CompanyRef;
    posRef: PosRef;
}


export class AccountFactory {

    static fromJSONAccountReviver = (key, value)=>{
        if (key == 'description') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }

}