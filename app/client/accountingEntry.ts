/**
 * Created by cghislai on 06/08/15.
 */


import {AccountingEntry, AccountingEntryRef, AccountingEntrySearch, AccountingEntryFactory} from 'client/domain/accountingEntry';
import {Pagination} from 'client/utils/pagination';
import {ComptoirRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/search';
import {ServiceConfig} from 'client/utils/service';


export class AccountingEntryClient {

    private static RESOURCE_PATH:string = "/accountingEntry";

    private getAccountingEntryUrl(id?:number) {
        var url = ServiceConfig.URL + AccountingEntryClient.RESOURCE_PATH;
        if (id != undefined) {
            url += "/" + id;
        }
        return url;
    }


    private getSearchUrl(pagination:Pagination) {
        var url = ServiceConfig.URL + AccountingEntryClient.RESOURCE_PATH;
        url += '/search';
        if (pagination != null) {
            url += '?offset=';
            url += pagination.firstIndex;
            url += "&length=";
            url += pagination.pageSize;
        }
        return url;
    }

    createAccountingEntry(accountingEntry:AccountingEntry, authToken:string):Promise<AccountingEntryRef> {
        var request = new ComptoirRequest();
        var url = this.getAccountingEntryUrl();

        return request
            .post(accountingEntry, url, authToken)
            .then(function (response) {
                var accountingEntryRef = JSON.parse(response.text);
                return accountingEntryRef;
            });
    }

    getCreateAccountingEntryRequest(accountingEntry:AccountingEntry, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getAccountingEntryUrl();

        request.setup('POST', url, authToken);
        request.setupData(accountingEntry);
        return request;
    }

    updateAccountingEntry(accountingEntry:AccountingEntry, authToken:string):Promise<AccountingEntryRef> {
        var request = new ComptoirRequest();
        var url = this.getAccountingEntryUrl(accountingEntry.id);

        return request
            .put(accountingEntry, url, authToken)
            .then(function (response) {
                var accountingEntryRef = JSON.parse(response.text);
                return accountingEntryRef;
            });
    }

    getUpdateAccountingEntryRequest(accountingEntry:AccountingEntry, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getAccountingEntryUrl(accountingEntry.id);

        request.setup('PUT', url, authToken);
        request.setupData(accountingEntry);
        return request;
    }


    getAccountingEntry(id:number, authToken:string):Promise<AccountingEntry> {
        var request = new ComptoirRequest();
        var url = this.getAccountingEntryUrl(id);

        return request
            .get(url, authToken)
            .then(function (response) {
                var accountingEntry = JSON.parse(response.text, AccountingEntryFactory.fromJSONAccountingEntryReviver);
                return accountingEntry;
            });
    }

    getGetAccountingEntryRequest(id:number, authToken:string): ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getAccountingEntryUrl(id);

        request.setup('GET', url, authToken);
        return request;
    }

    searchAccountingEntrys(search:AccountingEntrySearch, pagination:Pagination, authToken:string):Promise<SearchResult<AccountingEntry>> {
        var request = new ComptoirRequest();
        var url = this.getSearchUrl(pagination);

        return request
            .post(search, url, authToken)
            .then(function (response) {
                var result = new SearchResult<AccountingEntry>().parseResponse(response, AccountingEntryFactory.fromJSONAccountingEntryReviver);
                return result;
            });
    }

    getSearchAccountingEntriesRequest(search:AccountingEntrySearch, pagination:Pagination, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getSearchUrl(pagination);

        request.setup('POST', url, authToken);
        request.setupData(search);
        return request;
    }

    deleteAccountingEntry(id:number, authToken:string):Promise<any> {
        var request = new ComptoirRequest();
        var url = this.getAccountingEntryUrl(id);

        return request
            .delete(url, authToken)
            .then(function (response) {
                return null;
            });
    }


    getDeleteAccountingEntryRequest(id:number, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getAccountingEntryUrl(id);

        request.setup('DELETE', url, authToken);
        return request;
    }


}