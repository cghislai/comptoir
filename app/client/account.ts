/**
 * Created by cghislai on 06/08/15.
 */

import {AccountType, Account, AccountRef, AccountSearch, AccountFactory} from 'client/domain/account';
import {LocaleText, LocaleTextFactory} from 'client/domain/lang';
import {PromiseRequest} from 'client/utils/request';
export class AccountClient {

    private static serviceUrl:string = "http://somewhere.com/accout";

    private getAccountUrl(id?:number) {
        var url = AccountClient.serviceUrl;
        if (id != undefined) {
            url += "/" + id;
        }
        return url;
    }

    private getSearchUrl() {
        var url = AccountClient.serviceUrl;
        url += '/search';
        return url;
    }

    createAccount(account:Account):Promise<AccountRef> {
        var request = new PromiseRequest();
        var url = this.getAccountUrl();
        var accountJSON = JSON.stringify(account);

        return request
            .post(accountJSON, url)
            .then(function (response) {
                var accountRef = AccountFactory.getAccountRefFromJSON(response);
                return accountRef;
            })
    }

    updateAccount(account:Account):Promise<AccountRef> {
        var request = new PromiseRequest();
        var url = this.getAccountUrl(account.id);
        var accountJSON = JSON.stringify(account);

        return request
            .put(accountJSON, url)
            .then(function (response) {
                var accountRef = AccountFactory.getAccountRefFromJSON(response);
                return accountRef;
            });
    }

    getAccount(id:number):Promise<Account> {
        var request = new PromiseRequest();
        var url = this.getAccountUrl(id);

        return request
            .get(url)
            .then(function (response) {
                var account = AccountFactory.getAccountFromJSON(response);
                return account;
            });
    }

    findAccounts(search:AccountSearch):Promise<Account[]> {
        var request = new PromiseRequest();
        var url = this.getSearchUrl();
        var searchJSON = JSON.stringify(search);

        return request
            .post(searchJSON, url)
            .then(function (response) {
                var accountsArray = AccountFactory.getAccountsArrayFromJson(response);
                return accountsArray;
            });
    }
}