/**
 * Created by cghislai on 16/08/15.
 */
/**
 * Created by cghislai on 06/08/15.
 */


import {MoneyPile, MoneyPileRef, MoneyPileSearch, MoneyPileFactory} from 'client/domain/moneyPile';
import {Pagination} from 'client/utils/pagination';
import {ComptoirRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/search';
import {ServiceConfig} from 'client/utils/service';


export class MoneyPileClient {

    private static RESOURCE_PATH:string = "/moneyPile";

    private getMoneyPileUrl(id?:number) {
        var url = ServiceConfig.URL + MoneyPileClient.RESOURCE_PATH;
        if (id != undefined) {
            url += "/" + id;
        }
        return url;
    }

    private getSearchUrl(pagination:Pagination) {
        var url = ServiceConfig.URL + MoneyPileClient.RESOURCE_PATH;
        url += '/search';
        if (pagination != null) {
            url += '?offset=';
            url += pagination.firstIndex;
            url += "&length=";
            url += pagination.pageSize;
        }
        return url;
    }

    createMoneyPile(moneyPile:MoneyPile, authToken:string):Promise<MoneyPileRef> {
        var request = new ComptoirRequest();
        var url = this.getMoneyPileUrl();

        return request
            .post(moneyPile, url, authToken)
            .then(function (response) {
                var moneyPileRef = JSON.parse(response.text);
                return moneyPileRef;
            })
    }

    updateMoneyPile(moneyPile:MoneyPile, authToken:string):Promise<MoneyPileRef> {
        var request = new ComptoirRequest();
        var url = this.getMoneyPileUrl(moneyPile.id);

        return request
            .put(moneyPile, url, authToken)
            .then(function (response) {
                var moneyPileRef = JSON.parse(response.text);
                return moneyPileRef;
            });
    }


    getMoneyPile(id:number, authToken:string):Promise<MoneyPile> {
        var request = new ComptoirRequest();
        var url = this.getMoneyPileUrl(id);

        return request
            .get(url, authToken)
            .then(function (response) {
                var moneyPile= JSON.parse(response.text, MoneyPileFactory.fromJSONMoneyPileReviver);
                return moneyPile;
            });
    }

}