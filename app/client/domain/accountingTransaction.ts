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
            jsonReviver: AccountingTransactionFactory.fromJSONAccountTransactionReviver
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
    link
}

export class AccountingTransactionFactory {
    static fromJSONAccountTransactionReviver = (key, value)=>{
        return value;
    }

}