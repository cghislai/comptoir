/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {BasicClient, BasicCacheHandler, BasicClientResourceInfo} from 'client/utils/basicClient';



export class AccountingTransactionClient extends BasicClient<AccountingTransaction> {

    private static RESOURCE_PATH:string = "/accountingTransaction";
    constructor() {
        super({
            resourcePath: AccountingTransactionClient.RESOURCE_PATH,
            jsonReviver: AccountingTransactionFactory.fromJSONAccountTransactionReviver,
            cacheHandler: AccountingTransactionFactory.cacheHandler
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
    static cacheHandler = new BasicCacheHandler<AccountingTransaction>();
    static fromJSONAccountTransactionReviver = (key, value)=>{
        return value;
    }
}