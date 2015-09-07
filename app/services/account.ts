/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/angular2';

import {LocalAccount, LocalAccountFactory} from 'client/localDomain/account';
import {AccountClient, Account, AccountType, AccountRef, AccountSearch} from 'client/domain/account';
import {LocaleTexts} from 'client/utils/lang';
import {SearchResult} from 'client/utils/search';
import {Pagination} from 'client/utils/pagination';

import {AuthService} from 'services/auth';

export class AccountService {

    client:AccountClient;
    authService:AuthService;

    lastUsedBalanceAccount:Account;

    constructor(@Inject authService:AuthService) {
        this.client = new AccountClient();
        this.authService = authService;
    }


    createAccount(account:Account):Promise<AccountRef> {
        var authToken = this.authService.authToken;
        account.companyRef = this.authService.loggedEmployee.companyRef;
        return this.client.create(account, authToken);
    }

    updateAccount(account:Account):Promise<AccountRef> {
        var authToken = this.authService.authToken;
        return this.client.update(account, authToken);
    }


    saveAccount(account:Account):Promise<AccountRef> {
        var savePromise:Promise<AccountRef>;
        if (account.id == undefined) {
            savePromise = this.createAccount(account);
        } else {
            savePromise = this.updateAccount(account);
        }
        return savePromise.then((accountRef)=> {
            account.id = accountRef.id;
            return accountRef;
        });
    }

    getAccount(id:number):Promise<Account> {
        var authToken = this.authService.authToken;
        return this.client.get(id, authToken);
    }

    searchAccounts(accountSearch:AccountSearch, pagination:Pagination):Promise<SearchResult<Account>> {
        var authToken = this.authService.authToken;
        accountSearch.companyRef = this.authService.loggedEmployee.companyRef;
        return this.client.search(accountSearch, pagination, authToken);
    }


    removeAccount(account:Account):Promise<boolean> {
        var authToken = this.authService.authToken;
        return this.client.remove(account.id, authToken);
    }

    public getLocalAccountAsync(accountId:number) {
        return this.getAccount(accountId)
            .then((account)=> {
                var localAccount = LocalAccountFactory.toLocalAccount(account);
                return localAccount;
            });
    }

    public searchLocalAccountsAsync(accountSearch:AccountSearch, pagination:Pagination):Promise<SearchResult<LocalAccount>> {
        return this.searchAccounts(accountSearch, pagination)
            .then((result)=> {
                var localResult = new SearchResult<LocalAccount>();
                localResult.count = result.count;
                localResult.list = [];
                for (var account of result.list) {
                    var localAccount = LocalAccountFactory.toLocalAccount(account);
                    localResult.list.push(localAccount);
                }
                return localResult;
            });
    }
}