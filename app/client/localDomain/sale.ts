/**
 * Created by cghislai on 01/09/15.
 */


import {CompanyRef, CompanyClient} from '../domain/company';
import {CustomerRef, Customer, CustomerClient, CustomerFactory} from '../domain/customer';
import {InvoiceRef, Invoice, InvoiceFactory, InvoiceClient} from '../domain/invoice';
import {AccountingTransactionRef, AccountingTransaction,
    AccountingTransactionClient, AccountingTransactionFactory} from '../domain/accountingTransaction'
import {Account} from '../domain/account';
import {ItemVariant, ItemVariantRef} from '../domain/itemVariant';
import {Sale, SaleRef} from '../domain/sale';
import {Pos} from '../domain/pos';
import {ItemVariantSale} from '../domain/itemVariantSale';

import {LocalItem} from './item';
import {LocalPicture} from './picture';
import {LocalItemVariant, LocalItemVariantFactory} from './itemvariant';
import {LocalAccountingEntry} from './accountingEntry';
import {LocalCompany, LocalCompanyFactory} from './company';

import {LocaleTexts} from '../utils/lang';
import {NumberUtils} from '../utils/number';

import * as Immutable from 'immutable';

export interface LocalSale extends Immutable.Map<string, any> {
    id:number;
    company:LocalCompany;
    customer:Customer;
    dateTime:Date;
    invoice:Invoice;
    vatExclusiveAmount:number;
    vatAmount:number;
    closed:boolean;
    reference:string;
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
export function NewSale(desc:any):LocalSale {
    return <any>SaleRecord(desc);
}


export class LocalSaleFactory {
    static companyClient = new CompanyClient();
    static customerClient = new CustomerClient();
    static invoiceClient = new InvoiceClient();

    static fromLocalSale(localSale:LocalSale):Sale {
        var sale = new Sale();
        sale.id = localSale.id;
        sale.accountingTransactionRef = localSale.accountingTransactionRef;
        sale.closed = localSale.closed;
        if (localSale.company !== null) {
            sale.companyRef = new CompanyRef(localSale.company.id);
        }
        if (localSale.customer !== null) {
            sale.customerRef = new CustomerRef(localSale.customer.id);
        }
        sale.dateTime = localSale.dateTime;
        sale.discountAmount = localSale.discountAmount;
        sale.discountRatio = localSale.discountRatio;
        if (localSale.invoice !== null) {
            sale.invoiceRef = new InvoiceRef(localSale.invoice.id);
        }
        sale.reference = localSale.reference;
        sale.vatAmount = localSale.vatAmount;
        sale.vatExclusiveAmount = localSale.vatExclusiveAmount;
        return sale;
    }

    static toLocalSale(sale:Sale, authToken:string):Promise<LocalSale> {
        var localSaleDesc:any = {};
        localSaleDesc.accountingTransactionRef = sale.accountingTransactionRef;
        localSaleDesc.id = sale.id;
        localSaleDesc.closed = sale.closed;
        localSaleDesc.dateTime = sale.dateTime;
        localSaleDesc.discountAmount = sale.discountAmount;
        localSaleDesc.discountRatio = sale.discountRatio;
        localSaleDesc.reference = sale.reference;
        localSaleDesc.vatAmount = sale.vatAmount;
        localSaleDesc.vatExclusiveAmount = sale.vatExclusiveAmount;

        var taskList = [];

        var companyRef = sale.companyRef;
        taskList.push(
            LocalSaleFactory.companyClient.getFromCacheOrServer(companyRef.id, authToken)
                .then((company)=> {
                    return LocalCompanyFactory.toLocalCompany(company, authToken);
                }).then((localCompany:LocalCompany) => {
                    localSaleDesc.company = localCompany;
                })
        );
        var customerRef = sale.customerRef;
        if (customerRef !== null) {
            taskList.push(
                LocalSaleFactory.customerClient.getFromCacheOrServer(customerRef.id, authToken)
                    .then((customer)=> {
                        localSaleDesc.customer = customer;
                    })
            );
        }
        var invoiceRef = sale.invoiceRef;
        if (invoiceRef !== null) {
            taskList.push(
                LocalSaleFactory.invoiceClient.getFromCacheOrServer(invoiceRef.id, authToken)
                    .then((invoice)=> {
                        localSaleDesc.invoice = invoice;
                    })
            );
        }

        return Promise.all(taskList)
            .then(()=> {
                return NewSale(localSaleDesc);
            });
    }


}