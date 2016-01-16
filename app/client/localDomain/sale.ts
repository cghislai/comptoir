/**
 * Created by cghislai on 01/09/15.
 */


import {LocalAccountingTransaction} from './accountingTransaction';
import {LocalCompany} from './company';
import {LocalCustomer} from './customer';
import {InvoiceRef} from '../domain/invoice';
import {AccountingTransactionRef} from '../domain/accountingTransaction';

import * as Immutable from 'immutable';

export interface LocalSale extends Immutable.Map<string, any> {
    id:number;
    company:LocalCompany;
    customer:LocalCustomer;
    dateTime:Date;
    invoiceRef:InvoiceRef; // Keep ref to avoid cyclic dependencies
    vatExclusiveAmount:number;
    vatAmount:number;
    closed:boolean;
    reference:string;
    // FIXME: implement service in backend
    accountingTransactionRef:AccountingTransactionRef;
    discountRatio:number;
    discountAmount:number;

    totalPaid:number;
}
var SaleRecord = Immutable.Record({
    id: null,
    company: null,
    customer: null,
    dateTime: null,
    invoice: null,
    vatExclusiveAmount: null,
    vatAmount: null,
    closed: null,
    reference: null,
    accountingTransactionRef: null,
    discountRatio: null,
    discountAmount: null
});

export class LocalSaleFactory {

    static createNewSale(desc:any):LocalSale {
        return <any>SaleRecord(desc);
    }

}