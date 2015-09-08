/**
 * Created by cghislai on 04/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {PosRef} from 'client/domain/pos';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';

import {BasicClient, BasicClientResourceInfo} from 'client/utils/basicClient';


export class AccountClient extends BasicClient<Account> {

    private static RESOURCE_PATH:string = "/account";
    constructor() {
        super({
            resourcePath: AccountClient.RESOURCE_PATH,
            jsonReviver: AccountFactory.fromJSONReviver,
            cache: AccountFactory.cache
        });
    }
}

export enum AccountType {
    PAYMENT,
    VAT,
    OTHER
}

export var ALL_ACCOUNT_TYPES : AccountType[] = [
    AccountType.OTHER,
    AccountType.PAYMENT,
    AccountType.VAT
];

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
    type: string;
}


export class AccountFactory {

    static fromJSONReviver = (key, value)=>{
        if (key == 'description') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }

    static cache: {[id: number] : Account} = {};
    static putInCache(account: Account) {
        var accountId = account.id;
        if (accountId == null) {
            throw 'no id';
        }
        AccountFactory.cache[accountId] = account;
    }

    static getFromCache(id: number) {
        return AccountFactory.cache[id];
    }

    static clearFromCache(id: number) {
        delete AccountFactory.cache[id];
    }

    static clearCache() {
        AccountFactory.cache = {};
    }

}