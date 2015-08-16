/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {CustomerRef} from 'client/domain/customer';
import {InvoiceRef} from 'client/domain/invoice';
import {AccountingTransactionRef} from 'client/domain/accountingTransaction'
export class Sale {
    id: number;
    companyRef: CompanyRef;
    customerRef: CustomerRef;
    dateTime: Date;
    invoiceRef: InvoiceRef;
    vatExclusiveAmount: number;
    vatAmount: number;
    closed: boolean;
    reference: string;
    accountingTransactionRef: AccountingTransactionRef;
    discountRatio: number;
    discountAmount: number;
}

export class SaleRef {
    id: number;
    link: string;

    constructor(id?:number) {
        this.id = id;
    }
}

export class SaleSearch {
    companyRef: CompanyRef;
    closed: boolean;
}

export class SaleFactory {
    static fromJSONSaleReviver = (key, value)=> {
        if (key == 'dateTime') {
            var date = new Date(value);
            return date;
        }
       return value;
    }

}