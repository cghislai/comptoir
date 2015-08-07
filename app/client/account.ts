/**
 * Created by cghislai on 06/08/15.
 */

import {AccountType, Account, AccountRef, AccountSearch, AccountFactory} from 'client/domain/account';
import {LocaleText, LocaleTextFactory} from 'client/domain/lang';
import {ComptoirrRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/searchResult';

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
        var request = new ComptoirrRequest();
        var url = this.getAccountUrl();
        var accountJSON = JSON.stringify(account);

        return request
            .post(accountJSON, url)
            .then(function (response) {
                var accountRef = AccountFactory.getAccountRefFromJSON(response.json);
                return accountRef;
            })
    }

    updateAccount(account:Account):Promise<AccountRef> {
        var request = new ComptoirrRequest();
        var url = this.getAccountUrl(account.id);
        var accountJSON = JSON.stringify(account);

        return request
            .put(accountJSON, url)
            .then(function (response) {
                var accountRef = AccountFactory.getAccountRefFromJSON(response.json);
                return accountRef;
            });
    }

    getAccount(id:number):Promise<Account> {
        var request = new ComptoirrRequest();
        var url = this.getAccountUrl(id);

        return request
            .get(url)
            .then(function (response) {
                var account = AccountFactory.getAccountFromJSON(response.json);
                return account;
            });
    }

    searchAccounts(search:AccountSearch):Promise<SearchResult<Account>> {
        var request = new ComptoirrRequest();
        var url = this.getSearchUrl();
        var searchJSON = JSON.stringify(search);

        return request
            .post(searchJSON, url)
            .then(function (response) {
                var result = new SearchResult<Account>().parseResponse(response, AccountFactory.getAccountFromJSON);
                return result;
            });
    }
}