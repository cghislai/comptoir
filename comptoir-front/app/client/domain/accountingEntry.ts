/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {AccountRef, AccountSearch} from 'client/domain/account';
import {AccountingTransactionRef} from 'client/domain/accountingTransaction';
import {CustomerRef} from 'client/domain/customer';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {BasicClient,BasicCacheHandler, BasicClientResourceInfo} from 'client/utils/basicClient';


export class AccountingEntryClient extends BasicClient<AccountingEntry> {

    private static RESOURCE_PATH:string = "/accountingEntry";
    constructor() {
        super(<BasicClientResourceInfo<AccountingEntry>>{
            resourcePath: AccountingEntryClient.RESOURCE_PATH,
            jsonReviver: AccountingEntryFactory.fromJSONAccountingEntryReviver,
            cacheHandler: AccountingEntryFactory.cacheHandler
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
    static cacheHandler = new BasicCacheHandler<AccountingEntry>();
    static fromJSONAccountingEntryReviver = (key, value)=>{
        if (key == 'description') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }
}