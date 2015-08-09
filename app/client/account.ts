/**
 * Created by cghislai on 06/08/15.
 */


import {Account, AccountRef, AccountSearch, AccountFactory} from 'client/domain/account';
import {ComptoirrRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/searchResult';
import {ServiceConfig} from 'client/utils/service';


export class AccountClient {

    private static RESOURCE_PATH:string = "/account";

    private getAccountUrl(id?:number) {
        var url = ServiceConfig.URL + AccountClient.RESOURCE_PATH;
        if (id != undefined) {
            url += "/" + id;
        }
        return url;
    }

    private getSearchUrl() {
        var url = ServiceConfig.URL + AccountClient.RESOURCE_PATH;
        url += '/search';
        return url;
    }

    createAccount(account:Account, authToken:string):Promise<AccountRef> {
        var request = new ComptoirrRequest();
        var url = this.getAccountUrl();

        return request
            .post(account, url, authToken)
            .then(function (response) {
                var accountRef = JSON.parse(response.text);
                return accountRef;
            })
    }

    updateAccount(account:Account, authToken:string):Promise<AccountRef> {
        var request = new ComptoirrRequest();
        var url = this.getAccountUrl(account.id);

        return request
            .put(account, url, authToken)
            .then(function (response) {
                var accountRef = JSON.parse(response.text);
                return accountRef;
            });
    }

    getAccount(id:number, authToken:string):Promise<Account> {
        var request = new ComptoirrRequest();
        var url = this.getAccountUrl(id);

        return request
            .get(url, authToken)
            .then(function (response) {
                var account = JSON.parse(response.text, AccountFactory.fromJSONAccountReviver);
                return account;
            });
    }

    searchAccounts(search:AccountSearch, authToken:string):Promise<SearchResult<Account>> {
        var request = new ComptoirrRequest();
        var url = this.getSearchUrl();
        var searchJSON = JSON.stringify(search);

        return request
            .post(searchJSON, url, authToken)
            .then(function (response) {
                var result = new SearchResult<Account>().parseResponse(response, AccountFactory.fromJSONAccountReviver);
                return result;
            });
    }
}