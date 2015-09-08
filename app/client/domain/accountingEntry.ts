/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {AccountRef, AccountSearch} from 'client/domain/account';
import {AccountingTransactionRef} from 'client/domain/accountingTransaction';
import {CustomerRef} from 'client/domain/customer';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {BasicClient, BasicClientResourceInfo} from 'client/utils/basicClient';


export class AccountingEntryClient extends BasicClient<AccountingEntry> {

    private static RESOURCE_PATH:string = "/accountingEntry";
    constructor() {
        super({
            resourcePath: AccountingEntryClient.RESOURCE_PATH,
            jsonReviver: AccountingEntryFactory.fromJSONAccountingEntryReviver,
            cache: AccountingEntryFactory.cache
        });
    }
}

export class AccountingEntry {
    id: number;
    companyRef: CompanyRef;
    accountRef: AccountRef;
    amount: number = 0;
    vatRate: number = 0;
    dateTime: Date;
    description: LocaleTexts;
    accountingTransactionRef: AccountingTransactionRef;
    vatAccountingEntryRef: AccountingEntryRef;
    customerRef: CustomerRef;
}

export class AccountingEntryRef {
    id: number;
    link: string;
    constructor(id?: number) {
        this.id = id;
    }
}


export class AccountingEntrySearch {
    companyRef : CompanyRef;
    accountingTransactionRef : AccountingTransactionRef;
    accountSearch: AccountSearch;
    fromDateTime : Date;
    toDateTime : Date;
}

export class AccountingEntryFactory {
    static fromJSONAccountingEntryReviver = (key, value)=>{
        if (key == 'description') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }

    static cache: {[id: number] : AccountingEntry} = {};
    static putInCache(accountingEntry: AccountingEntry) {
        var accountingEntryId = accountingEntry.id;
        if (accountingEntryId == null) {
            throw 'no id';
        }
        AccountingEntryFactory.cache[accountingEntryId] = accountingEntry;
    }

    static getFromCache(id: number) {
        return AccountingEntryFactory.cache[id];
    }

    static clearFromCache(id: number) {
        delete AccountingEntryFactory.cache[id];
    }

    static clearCache() {
        AccountingEntryFactory.cache = {};
    }
}