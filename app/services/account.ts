/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/angular2';

import {Account,AccountType, AccountRef, AccountSearch} from 'client/domain/account';
import {LocaleTexts} from 'client/utils/lang';
import {SearchResult} from 'client/utils/search';
import {AccountClient} from 'client/account';
import {Pagination} from 'client/utils/pagination';

import {AuthService} from 'services/auth';

export class AccountService {

    client:AccountClient;
    authService:AuthService;

    lastUsedBalanceAccount: Account;

    constructor(@Inject authService:AuthService) {
        this.client = new AccountClient();
        this.authService = authService;
    }


    createAccount(account:Account):Promise<AccountRef> {
        var authToken = this.authService.authToken;
        account.companyRef = this.authService.loggedEmployee.companyRef;
        return this.client.createAccount(account, authToken);
    }

    updateAccount(account:Account):Promise<AccountRef> {
        var authToken = this.authService.authToken;
        return this.client.updateAccount(account, authToken);
    }


    saveAccount(account: Account) : Promise<AccountRef> {
        var savePromise : Promise<AccountRef>;
        if (account.id == undefined) {
            savePromise = this.createAccount(account);
        } else {
            savePromise = this.updateAccount(account);
        }
        return savePromise.then((accountRef)=>{
            account.id = accountRef.id;
            return accountRef;
        });
    }

    getAccount(id:number):Promise<Account> {
        var authToken = this.authService.authToken;
        return this.client.getAccount(id, authToken);
    }

    searchAccounts(accountSearch:AccountSearch, pagination:Pagination):Promise<SearchResult<Account>> {
        var authToken = this.authService.authToken;
        accountSearch.companyRef = this.authService.loggedEmployee.companyRef;
        return this.client.searchAccounts(accountSearch, pagination, authToken);
    }


    removeAccount(account:Account):Promise<boolean> {
        var authToken = this.authService.authToken;
        // TODO
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

}