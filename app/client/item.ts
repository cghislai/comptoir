/**
 * Created by cghislai on 07/08/15.
 */

import {Item, ItemRef, ItemSearch, ItemFactory} from 'client/domain/item';
import {ComptoirRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/search';
import {ServiceConfig} from 'client/utils/service';
import {Pagination} from'client/utils/pagination';

export class ItemClient {
    private static RESOURCE_PATH = "/item";

    private getResourceUrl():string {
        return ServiceConfig.URL + ItemClient.RESOURCE_PATH;
    }

    private getItemUrl(id:number):string {
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


    createItem(item:Item, authToken:string):Promise<ItemRef> {
        var url = this.getResourceUrl();
        var request = new ComptoirRequest();
        return request.post(item, url, authToken)
            .then(function (response) {
                var itemRef = JSON.parse(response.text);
                return itemRef;
            });
    }

    updateItem(item:Item, authToken:string):Promise<ItemRef> {
        var url = this.getItemUrl(item.id);
        var request = new ComptoirRequest();
        return request.put(item, url, authToken)
            .then(function (response) {
                var itemRef = JSON.parse(response.text);
                return itemRef;
            });
    }

    getItem(id:number, authToken:string):Promise<Item> {
        var url = this.getItemUrl(id);
        var request = new ComptoirRequest();
        return request.get(url, authToken)
            .then(function (response) {
                var item = JSON.parse(response.text, ItemFactory.fromJSONItemReviver);
                return item;
            });
    }

    getGetItemRequest(id:number, authToken:string):ComptoirRequest {
        var url = this.getItemUrl(id);
        var request = new ComptoirRequest();
        request.setup('GET', url, authToken);
        return request;
    }

    searchItems(search:ItemSearch, pagination:Pagination, authToken:string):Promise<SearchResult<Item>> {
        var url = this.getSearchUrl(pagination);
        var request = new ComptoirRequest();
        return request.post(search, url, authToken)
            .then(function (response) {
                var result = new SearchResult<Item>().parseResponse(response, ItemFactory.fromJSONItemReviver);
                return result;
            });
    }


}