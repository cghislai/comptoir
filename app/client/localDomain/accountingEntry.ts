/**
 * Created by cghislai on 02/09/15.
 */

import {AccountingEntry, AccountingEntryRef, AccountingEntryClient, AccountingEntryFactory} from 'client/domain/accountingEntry';
import {AccountClient, AccountRef} from 'client/domain/account';
import {LocalAccount, LocalAccountFactory} from 'client/localDomain/account';
import {Company, CompanyRef, CompanyClient, CompanyFactory} from 'client/domain/company';
import {LocalCompany, LocalCompanyFactory} from 'client/localDomain/company';
import {AccountingTransactionRef, AccountingTransaction, AccountingTransactionClient, AccountingTransactionFactory} from 'client/domain/accountingTransaction';
import {CustomerRef, Customer,CustomerClient, CustomerFactory} from 'client/domain/customer';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {ComptoirRequest} from 'client/utils/request';

export class LocalAccountingEntry {
    id:number;
    company:LocalCompany;
    amount:number = 0;
    vatRate:number = 0;
    dateTime:Date;
    description:LocaleTexts = new LocaleTexts();
    accountingTransactionRef:AccountingTransactionRef;
    vatAccountingEntry:LocalAccountingEntry;
    customer:Customer;

    account:LocalAccount;
}

export class LocalAccountingEntryFactory {
    static toLocalAccountingEntry(accountingEntry:AccountingEntry, authToken:string):Promise<LocalAccountingEntry> {
        var localAccountingEntry = new LocalAccountingEntry();
        return LocalAccountingEntryFactory.updateLocalAccountingEntry(localAccountingEntry, accountingEntry, authToken);
    }

    static updateLocalAccountingEntry(localAccountingEntry:LocalAccountingEntry, accountingEntry:AccountingEntry, authToken:string):Promise<LocalAccountingEntry> {
        localAccountingEntry.amount = accountingEntry.amount;
        localAccountingEntry.dateTime = accountingEntry.dateTime;
        localAccountingEntry.description = accountingEntry.description;
        localAccountingEntry.id = accountingEntry.id;
        localAccountingEntry.vatRate = accountingEntry.vatRate;
        localAccountingEntry.accountingTransactionRef = accountingEntry.accountingTransactionRef;

        var taskList = [];

        var accontRef = accountingEntry.accountRef;
        var accountId = accontRef.id;
        var accoutClient = new AccountClient();
        taskList.push(
            accoutClient.getFromCacheOrServer(accountId, authToken)
                .then((account)=> {
                    return LocalAccountFactory.toLocalAccount(account, authToken);
                })
                .then((localAccount:LocalAccount)=> {
                    localAccountingEntry.account = localAccount;
                })
        );
        var companyRef = accountingEntry.companyRef;
        var companyId = companyRef.id;
        var companyClient = new CompanyClient();
        taskList.push(
            companyClient.getFromCacheOrServer(companyId, authToken)
                .then((company)=> {
                    return LocalCompanyFactory.toLocalCompany(company, authToken);
                }).then((localCompany:LocalCompany)=> {
                    localAccountingEntry.company = localCompany;
                })
        );
        var customerRef = accountingEntry.customerRef;
        if (customerRef != null) {
            var customerId = customerRef.id;
            var customerClient = new CustomerClient();
            taskList.push(
                customerClient.getFromCacheOrServer(customerId, authToken)
                    .then((customer)=> {
                        localAccountingEntry.customer = customer;
                    })
            );
        }
        var vatAccountingEntryRef = accountingEntry.vatAccountingEntryRef;
        if (vatAccountingEntryRef != null) {
            var vatEntryId = vatAccountingEntryRef.id;
            var entryClient = new AccountingEntryClient();
            taskList.push(
                entryClient.getFromCacheOrServer(vatEntryId, authToken)
                    .then((entry:AccountingEntry)=> {
                        return LocalAccountingEntryFactory.toLocalAccountingEntry(entry, authToken);
                    }).then((localEntry:LocalAccountingEntry)=> {
                        localAccountingEntry.vatAccountingEntry = localEntry;
                    })
            );
        }

        return Promise.all(taskList)
            .then(()=> {
                return localAccountingEntry;
            });

    }

    static fromLocalAccountingEntry(localAccountingEntry:LocalAccountingEntry) {
        var accountingEntry = new AccountingEntry();
        accountingEntry.accountingTransactionRef = localAccountingEntry.accountingTransactionRef;
        accountingEntry.accountRef = new AccountRef(localAccountingEntry.account.id);
        accountingEntry.amount = localAccountingEntry.amount;
        accountingEntry.companyRef = new CompanyRef(localAccountingEntry.company.id);
        if (localAccountingEntry.customer != null) {
            accountingEntry.customerRef = new CustomerRef(localAccountingEntry.customer.id);
        }
        accountingEntry.dateTime = localAccountingEntry.dateTime;
        accountingEntry.description = localAccountingEntry.description;
        accountingEntry.id = localAccountingEntry.id;
        if (localAccountingEntry.vatAccountingEntry != null) {
            accountingEntry.vatAccountingEntryRef = new AccountingEntryRef(localAccountingEntry.vatAccountingEntry.id);
        }
        accountingEntry.vatRate = localAccountingEntry.vatRate;
        return accountingEntry;
    }
}