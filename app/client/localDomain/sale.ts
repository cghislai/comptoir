/**
 * Created by cghislai on 01/09/15.
 */

import {LocalItem} from 'client/localDomain/item';
import {LocalPicture} from 'client/localDomain/picture';
import {LocalItemVariant, LocalItemVariantFactory} from 'client/localDomain/itemvariant';
import {LocalAccountingEntry} from 'client/localDomain/accountingEntry';
import {LocalCompany, LocalCompanyFactory} from 'client/localDomain/company';

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
import {ComptoirRequest}  from 'client/utils/request';
import {LocaleTexts} from 'client/utils/lang';
import {NumberUtils} from 'client/utils/number';


export class LocalSale {
    id:number;
    company:LocalCompany;
    customer:Customer;
    dateTime:Date;
    invoice:Invoice;
    vatExclusiveAmount:number;
    vatAmount:number;
    closed:boolean;
    reference:string;
    accountingTransaction:AccountingTransaction;
    discountRatio:number;
    discountAmount:number;

    totalPaid:number;
    totalPaidRequest:ComptoirRequest;
}

export class LocalSaleFactory {

    static fromLocalSale(localSale:LocalSale):Sale {
        var sale = new Sale();
        sale.id = localSale.id;
        if (localSale.accountingTransaction != null) {
            sale.accountingTransactionRef = new AccountingTransactionRef(localSale.accountingTransaction.id);
        }
        sale.closed = localSale.closed;
        sale.companyRef = new CompanyRef(localSale.company.id);
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
        var localSale = new LocalSale();
        return LocalSaleFactory.updateLocalSale(localSale, sale, authToken);
    }

    static updateLocalSale(localSale:LocalSale, sale:Sale, authToken:string):Promise<LocalSale> {
        localSale.id = sale.id;
        localSale.closed = sale.closed;
        localSale.dateTime = sale.dateTime;
        localSale.discountAmount = sale.discountAmount;
        localSale.discountRatio = sale.discountRatio;
        localSale.reference = sale.reference;
        localSale.vatAmount = sale.vatAmount;
        localSale.vatExclusiveAmount = sale.vatExclusiveAmount;

        var taskList = [];
        var accountingTransactionRef = sale.accountingTransactionRef;
        if (accountingTransactionRef != null) {
            var transactionid = accountingTransactionRef.id;
            var transactionClient = new AccountingTransactionClient();
            taskList.push(
                transactionClient.getFromCacheOrServer(transactionid, authToken)
                    .then((transaction)=> {
                        localSale.accountingTransaction = transaction;
                    })
            );
        }

        var companyRef = sale.companyRef;
        var companyClient = new CompanyClient();
        taskList.push(
            companyClient.getFromCacheOrServer(companyRef.id, authToken)
                .then((company)=> {
                    return LocalCompanyFactory.toLocalCompany(company, authToken);
                }).then((localCompany:LocalCompany) => {
                    localSale.company = localCompany;
                })
        );
        var customerRef = sale.customerRef;
        if (customerRef != null) {
            var customerClient = new CustomerClient();
            taskList.push(
                customerClient.getFromCacheOrServer(customerRef.id, authToken)
                    .then((customer)=> {
                        localSale.customer = customer;
                    })
            );
        }
        var invoiceRef = sale.invoiceRef;
        if (invoiceRef != null) {
            var invoiceClient = new InvoiceClient();
            taskList.push(
                invoiceClient.getFromCacheOrServer(invoiceRef.id, authToken)
                    .then((invoice)=> {
                        localSale.invoice = invoice;
                    })
            );
        }

        return Promise.all(taskList)
            .then(()=> {
                return localSale;
            });
    }


}