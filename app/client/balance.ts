/**
 * Created by cghislai on 16/08/15.
 */
/**
 * Created by cghislai on 06/08/15.
 */


import {Balance, BalanceRef, BalanceSearch, BalanceFactory} from 'client/domain/balance';
import {Pagination} from 'client/utils/pagination';
import {ComptoirRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/search';
import {ServiceConfig} from 'client/utils/service';


export class BalanceClient {

    private static RESOURCE_PATH:string = "/balance";

    private getBalanceUrl(id?:number) {
        var url = ServiceConfig.URL + BalanceClient.RESOURCE_PATH;
        if (id != undefined) {
            url += "/" + id;
        }
        return url;
    }



    private getSearchUrl(pagination:Pagination) {
        var url = ServiceConfig.URL + BalanceClient.RESOURCE_PATH;
        url += '/search';
        if (pagination != null) {
            url += '?offset=';
            url += pagination.firstIndex;
            url += "&length=";
            url += pagination.pageSize;
        }
        return url;
    }

    createBalance(balance:Balance, authToken:string):Promise<BalanceRef> {
        var request = new ComptoirRequest();
        var url = this.getBalanceUrl();

        return request
            .post(balance, url, authToken)
            .then(function (response) {
                var balanceRef = JSON.parse(response.text);
                return balanceRef;
            })
    }

    updateBalance(balance:Balance, authToken:string):Promise<BalanceRef> {
        var request = new ComptoirRequest();
        var url = this.getBalanceUrl(balance.id);

        return request
            .put(balance, url, authToken)
            .then(function (response) {
                var balanceRef = JSON.parse(response.text);
                return balanceRef;
            });
    }



    getBalance(id:number, authToken:string):Promise<Balance> {
        var request = new ComptoirRequest();
        var url = this.getBalanceUrl(id);

        return request
            .get(url, authToken)
            .then(function (response) {
                var balance = JSON.parse(response.text, BalanceFactory.fromJSONBalanceReviver);
                return balance;
            });
    }

    searchBalances(search:BalanceSearch, pagination:Pagination, authToken:string):Promise<SearchResult<Balance>> {
        var request = new ComptoirRequest();
        var url = this.getSearchUrl(pagination);

        return request
            .post(search, url, authToken)
            .then(function (response) {
                var result = new SearchResult<Balance>().parseResponse(response, BalanceFactory.fromJSONBalanceReviver);
                return result;
            });
    }

    deleteBalance(id: number, authToken: string) : Promise<any> {
        var request = new ComptoirRequest();
        var url = this.getBalanceUrl(id);

        return request
            .delete(url, authToken)
            .then(function (response) {
                return null;
            });
    }

    closeBalance(id: number, authToken: string) : Promise<BalanceRef> {
        var request = new ComptoirRequest();
        var url = this.getBalanceUrl(id);
        url += "/state/CLOSED";

        return request
            .put(null, url, authToken)
            .then(function (response) {
                var balanceRef = JSON.parse(response.text);
                return balanceRef;
            });
    }
}