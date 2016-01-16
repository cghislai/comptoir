/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from './company';


export enum AccountingTransactionType {
    SALE,
    PURCHASE,
    TRANSFER
}

export class AccountingTransaction {
    id:number;
    companyRef:CompanyRef;
    dateTime:Date;
    accountingTransactionType:AccountingTransactionType;
}

export class AccountingTransactionRef {
    id: number;
    link: string;
    constructor(id?: number) {
        this.id = id;
    }
}

export class AccountingTransactionFactory {
    static fromJSONReviver = (key, value)=>{
        return value;
    }
}