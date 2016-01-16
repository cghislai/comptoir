/**
 * Created by cghislai on 29/07/15.
 */
import {Injectable} from 'angular2/core';

import {AccountingTransaction, AccountingTransactionRef, AccountingTransactionFactory} from '../client/domain/accountingTransaction';
import {Account, AccountType, AccountRef} from '../client/domain/account';
import {Company, CompanyRef} from '../client/domain/company';
import {Customer,CustomerRef} from '../client/domain/customer';

import {LocalAccountingTransaction, LocalAccountingTransactionFactory} from '../client/localDomain/accountingTransaction';
import {LocalAccount} from '../client/localDomain/account';

import {WithId} from '../client/utils/withId';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {AccountingTransactionClient} from '../client/accountingTransaction';

import {AuthService} from './auth';
import {CompanyService} from './company';

@Injectable()
export class AccountingTransactionService {

    accountingTransactionClient:AccountingTransactionClient;
    authService:AuthService;
    companyService:CompanyService;

    constructor(accountingTransactionClient:AccountingTransactionClient,
                authService:AuthService,
                companyService:CompanyService) {
        this.accountingTransactionClient = accountingTransactionClient;
        this.authService = authService;
        this.companyService = companyService;
    }

    get(id:number):Promise<LocalAccountingTransaction> {
        return this.accountingTransactionClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:AccountingTransaction)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.accountingTransactionClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalAccountingTransaction):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.accountingTransactionClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalAccountingTransaction>):Promise<SearchResult<LocalAccountingTransaction>> {
        return this.accountingTransactionClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<AccountingTransaction>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalAccountingTransaction>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    fromLocalConverter(localAccountingTransaction:LocalAccountingTransaction):AccountingTransaction {
        var accountingTransaction = new AccountingTransaction();
        accountingTransaction.accountingTransactionType = localAccountingTransaction.accountingTransactionType;
        if (localAccountingTransaction.company != null) {
            accountingTransaction.companyRef = new CompanyRef(localAccountingTransaction.company.id);
        }
        accountingTransaction.dateTime = localAccountingTransaction.dateTime;
        accountingTransaction.id = localAccountingTransaction.id;
        return accountingTransaction;
    }

    toLocalConverter(accountingTransaction:AccountingTransaction):Promise<LocalAccountingTransaction> {
        var localAccountingTransactionDesc:any = {};
        localAccountingTransactionDesc.id = accountingTransaction.id;
        localAccountingTransactionDesc.dateTime = accountingTransaction.dateTime;
        localAccountingTransactionDesc.accountingTransactionType = accountingTransaction.accountingTransactionType;

        var taskList = [];

        var companyRef = accountingTransaction.companyRef;
        var companyId = companyRef.id;

        taskList.push(
            this.companyService.get(companyId, this.getAuthToken())
                .then((company)=> {
                    localAccountingTransactionDesc.company = company;
                })
        );

        return Promise.all(taskList)
            .then(()=> {
                return LocalAccountingTransactionFactory.createAccountingTransaction(localAccountingTransactionDesc);
            });
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}