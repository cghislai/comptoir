/**
 * Created by cghislai on 02/09/15.
 */

import {Account, AccountType} from '../domain/account';
import {Company, CompanyRef} from '../domain/company';

import {LocalCompany} from './company';

import {LocaleTexts, LocaleTextsFactory} from '../utils/lang';

import * as Immutable from 'immutable';

export interface LocalAccount extends Immutable.Map<string, any> {
    id:number;
    company:LocalCompany;
    accountingNumber:string;
    iban:string;
    bic:string;
    name:string;
    description:LocaleTexts;
    accountType:AccountType;
    accountTypeLabel:LocaleTexts;
}

var AccountRecord = Immutable.Record({
    id: null,
    company: null,
    accountingNumber: null,
    iban: null,
    bic: null,
    name: null,
    description: null,
    accountType: null,
    accountTypeLabel: null
});

export class LocalAccountFactory {


    static ACCOUNT_TYPE_OTHER_LABEL = LocaleTextsFactory.toLocaleTexts({
        'fr': 'Autre'
    });
    static ACCOUNT_TYPE_VAT_LABEL = LocaleTextsFactory.toLocaleTexts({
        'fr': 'TVA'
    });
    static ACCOUNT_TYPE_PAIMENT_LABEL = LocaleTextsFactory.toLocaleTexts({
        'fr': 'Paiment'
    });

    static getAccountTypeLabel(accountType:AccountType):LocaleTexts {
        switch (accountType) {
            case AccountType.OTHER:
            {
                return LocalAccountFactory.ACCOUNT_TYPE_OTHER_LABEL;
            }
            case AccountType.PAYMENT:
            {
                return LocalAccountFactory.ACCOUNT_TYPE_PAIMENT_LABEL;
            }
            case AccountType.VAT:
            {
                return LocalAccountFactory.ACCOUNT_TYPE_VAT_LABEL;
            }
        }
        return null;
    }

    static createNewAccount(desc:any):LocalAccount {
        return <any>AccountRecord(desc);
    }

}
