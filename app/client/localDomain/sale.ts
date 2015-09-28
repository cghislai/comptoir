/**
 * Created by cghislai on 01/09/15.
 */


import {CompanyRef, Company, CompanyClient, CompanyFactory} from 'client/domain/company';
import {CustomerRef, Customer, CustomerClient, CustomerFactory} from 'client/domain/customer';
import {InvoiceRef, Invoice, InvoiceFactory, InvoiceClient} from 'client/domain/invoice';
import {AccountingTransactionRef, AccountingTransaction,
    AccountingTransactionClient, AccountingTransactionFactory} from 'client/domain/accountingTransaction'
import {Account} from 'client/domain/account';
import {ItemVariant, ItemVariantRef} from 'client/domain/itemVariant';
import {Sale, SaleRef} from 'client/domain/sale';
import {Pos} from 'client/domain/pos';
import {ItemVariantSale} from 'client/domain/itemVariantSale';

import {LocalItem} from 'client/localDomain/item';
import {LocalPicture} from 'client/localDomain/picture';
import {LocalItemVariant, LocalItemVariantFactory} from 'client/localDomain/itemvariant';
import {LocalAccountingEntry} from 'client/localDomain/accountingEntry';
import {LocalCompany, LocalCompanyFactory} from 'client/localDomain/company';

import {LocaleTexts} from 'client/utils/lang';
import {NumberUtils} from 'client/utils/number';

import {Map, Record} from 'immutable';

export interface LocalSale extends Map<string, any> {
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
var SaleRecord = Record({
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
        localSale = localSale.toJS();
        var sale = new Sale();
        sale.id = localSale.id;
        sale.accountingTransactionRef = localSale.accountingTransactionRef;
        sale.closed = localSale.closed;
        if (localSale.company != null) {
            sale.companyRef = new CompanyRef(localSale.company.id);
        }
        if (localSale.customer != null) {
            sale.customerRef = new CustomerRef(localSale.customer.id);
        }
        sale.dateTime = localSale.dateTime;
        sale.discountAmount = localSale.discountAmount;
        sale.discountRatio = localSale.discountRatio;
        if (localSale.invoice != null) {
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
        if (customerRef != null) {
            taskList.push(
                LocalSaleFactory.customerClient.getFromCacheOrServer(customerRef.id, authToken)
                    .then((customer)=> {
                        localSaleDesc.customer = customer;
                    })
            );
        }
        var invoiceRef = sale.invoiceRef;
        if (invoiceRef != null) {
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