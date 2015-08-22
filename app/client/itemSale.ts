/**
 * Created by cghislai on 14/08/15.
 */

import {ItemSale, ItemSaleRef, ItemSaleSearch, ItemSaleFactory} from 'client/domain/itemSale';
import {ServiceConfig} from 'client/utils/service';
import {Pagination} from 'client/utils/pagination';
import {SearchResult} from 'client/utils/search';
import {ComptoirRequest, ComptoirResponse} from "client/utils/request";

export class ItemSaleClient {
    private static RESOURCE_PATH = "/itemSale";

    private getResourceUrl():string {
        return ServiceConfig.URL + ItemSaleClient.RESOURCE_PATH;
    }

    private getItemSaleUrl(id:number):string {
        var url = this.getResourceUrl();
        url += "/" + id;
        return url;
    }

    private getSearchUrl(pagination:Pagination):string {
        var url = this.getResourceUrl();
        url += "/search";
        if (pagination != null) {
            url += '?offset=';
            url += pagination.firstIndex;
            url += "&length=";
            url += pagination.pageSize;
        }
        return url;
    }


    createItemSale(itemSale:ItemSale, authToken:string):Promise<ItemSaleRef> {
        var url = this.getResourceUrl();
        var request = new ComptoirRequest();
        return request.post(itemSale, url, authToken)
            .then(function (response) {
                var itemSaleRef = JSON.parse(response.text);
                return itemSaleRef;
            });
    }


    getCreateItemSaleRequest(itemSale:ItemSale, authToken:string):ComptoirRequest{
        var url = this.getResourceUrl();
        var request = new ComptoirRequest();
        request.setup('POST', url, authToken);
        request.setupData(itemSale);
        return request;
    }

    updateItemSale(itemSale:ItemSale, authToken:string):Promise<ItemSaleRef> {
        var url = this.getItemSaleUrl(itemSale.id);
        var request = new ComptoirRequest();
        return request.put(itemSale, url, authToken)
            .then(function (response) {
                var itemSaleRef = JSON.parse(response.text);
                return itemSaleRef;
            });
    }

    getUpdateItemSaleRequest(itemSale:ItemSale, authToken:string):ComptoirRequest{
        var url = this.getResourceUrl();
        var request = new ComptoirRequest();
        request.setup('POST', url, authToken);
        request.setupData(itemSale);
        return request;
    }

    getItemSale(id:number, authToken:string):Promise<ItemSale> {
        var url = this.getItemSaleUrl(id);
        var request = new ComptoirRequest();
        return request.get(url, authToken)
            .then(function (response) {
                var itemSale = JSON.parse(response.text, ItemSaleFactory.fromJSONItemSaleReviver);
                return itemSale;
            });
    }
    getGetItemSaleRequest(id:number, authToken:string):ComptoirRequest {
        var url = this.getItemSaleUrl(id);
        var request = new ComptoirRequest();
        request.setup('GET', url, authToken);
        return request;
    }



    searchItemSales(search:ItemSaleSearch, pagination:Pagination, authToken:string):Promise<SearchResult<ItemSale>> {
        var url = this.getSearchUrl(pagination);
        var request = new ComptoirRequest();
        return request.post(search, url, authToken)
            .then(function (response) {
                var result = new SearchResult<ItemSale>().parseResponse(response, ItemSaleFactory.fromJSONItemSaleReviver);
                return result;
            });
    }

    getSearchItemSalesRequest(search:ItemSaleSearch, pagination:Pagination, authToken:string):ComptoirRequest {
        var url = this.getSearchUrl(pagination);
        var request = new ComptoirRequest();
        request.setup('POST', url, authToken);
        request.setupData(search);
        return request;
    }

    removeItemSale(id:number, authToken:string):Promise<any> {
        var url = this.getItemSaleUrl(id);
        var request = new ComptoirRequest();
        return request.delete(url, authToken);
    }


}
