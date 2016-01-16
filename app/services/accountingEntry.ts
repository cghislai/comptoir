/**
 * Created by cghislai on 29/07/15.
 */
import {Injectable} from 'angular2/core';

import {AccountingEntry, AccountingEntryRef, AccountingEntryFactory} from '../client/domain/accountingEntry';
import {Account, AccountType, AccountRef} from '../client/domain/account';
import {Company, CompanyRef} from '../client/domain/company';
import {Customer,CustomerRef} from '../client/domain/customer';

import {LocalAccountingEntry, LocalAccountingEntryFactory} from '../client/localDomain/accountingEntry';
import {LocalAccount} from '../client/localDomain/account';

import {WithId} from '../client/utils/withId';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {AccountingEntryClient} from '../client/accountingEntry';

import {AuthService} from './auth';
import {AccountService} from './account';
import {CompanyService} from './company';
import {CustomerService} from './customer';

@Injectable()
export class AccountingEntryService {


    accountingEntryClient:AccountingEntryClient;
    authService:AuthService;
    accountService:AccountService;
    companyService:CompanyService;
    customerService:CustomerService;

    constructor(accountingEntryClient:AccountingEntryClient,
                authService:AuthService,
                accountService:AccountService,
                companyService:CompanyService,
                customerService:CustomerService) {
        this.accountingEntryClient = accountingEntryClient;
        this.authService = authService;
        this.accountService = accountService;
        this.companyService = companyService;
        this.customerService = customerService;
    }

    get(id:number):Promise<LocalAccountingEntry> {
        return this.accountingEntryClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:AccountingEntry)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.accountingEntryClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalAccountingEntry):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.accountingEntryClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalAccountingEntry>):Promise<SearchResult<LocalAccountingEntry>> {
        return this.accountingEntryClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<AccountingEntry>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalAccountingEntry>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(accountingEntry:AccountingEntry):Promise<LocalAccountingEntry> {
        var localAccountingEntryDesc:any = {};
        localAccountingEntryDesc.amount = accountingEntry.amount;
        localAccountingEntryDesc.dateTime = accountingEntry.dateTime;
        localAccountingEntryDesc.description = accountingEntry.description;
        localAccountingEntryDesc.id = accountingEntry.id;
        localAccountingEntryDesc.vatRate = accountingEntry.vatRate;
        localAccountingEntryDesc.accountingTransactionRef = accountingEntry.accountingTransactionRef;

        var taskList = [];

        var accountRef = accountingEntry.accountRef;
        var accountId = accountRef.id;

        taskList.push(
            this.accountService.get(accountId)
                .then((localAccount:LocalAccount)=> {
                    localAccountingEntryDesc.account = localAccount;
                })
        );
        var companyRef = accountingEntry.companyRef;
        var companyId = companyRef.id;
        taskList.push(
            this.companyService.get(companyId, this.getAuthToken())
                .then((company)=> {
                    localAccountingEntryDesc.company = company;
                })
        );
        var customerRef = accountingEntry.customerRef;
        if (customerRef != null) {
            var customerId = customerRef.id;
            taskList.push(
                this.customerService.get(customerId)
                    .then((customer)=> {
                        localAccountingEntryDesc.customer = customer;
                    })
            );
        }
        var vatAccountingEntryRef = accountingEntry.vatAccountingEntryRef;
        if (vatAccountingEntryRef != null) {
            var vatEntryId = vatAccountingEntryRef.id;
            taskList.push(
                this.get(vatEntryId)
                    .then((localEntry:LocalAccountingEntry)=> {
                        localAccountingEntryDesc.vatAccountingEntry = localEntry;
                    })
            );
        }

        return Promise.all(taskList)
            .then(()=> {
                return LocalAccountingEntryFactory.createAccountingEntry(localAccountingEntryDesc);
            });
    }

    fromLocalConverter(localAccountingEntry:LocalAccountingEntry):AccountingEntry {
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

    private getAuthToken():string {
        return this.authService.authToken;
    }
}