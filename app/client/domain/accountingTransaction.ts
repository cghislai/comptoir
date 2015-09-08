/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {BasicClient, BasicClientResourceInfo} from 'client/utils/basicClient';



export class AccountingTransactionClient extends BasicClient<AccountingTransaction> {

    private static RESOURCE_PATH:string = "/accountingTransaction";
    constructor() {
        super({
            resourcePath: AccountingTransactionClient.RESOURCE_PATH,
            jsonReviver: AccountingTransactionFactory.fromJSONAccountTransactionReviver,
            cache: AccountingTransactionFactory.cache
        });
    }
}

export enum AccountTransactionType {
    SALE,
    PURCHASE,
    TRANSFER
}

export class AccountingTransaction {
    id:number;
    companyRef:CompanyRef;
    dateTime:Date;
    accountingTransactionType:AccountTransactionType;
}

export class AccountingTransactionRef {
    id: number;
    link: string;
    constructor(id?: number) {
        this.id = id;
    }
}

export class AccountingTransactionFactory {
    static fromJSONAccountTransactionReviver = (key, value)=>{
        return value;
    }

    static cache: {[id: number] : AccountingTransaction} = {};
    static putInCache(accountingTransaction: AccountingTransaction) {
        var accountingTransactionId = accountingTransaction.id;
        if (accountingTransactionId == null) {
            throw 'no id';
        }
        AccountingTransactionFactory.cache[accountingTransactionId] = accountingTransaction;
    }

    static getFromCache(id: number) {
        return AccountingTransactionFactory.cache[id];
    }

    static clearFromCache(id: number) {
        delete AccountingTransactionFactory.cache[id];
    }

    static clearCache() {
        AccountingTransactionFactory.cache = {};
    }
}