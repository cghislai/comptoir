/**
 * Created by cghislai on 07/08/15.
 */

import {Item, ItemRef, ItemSearch, ItemFactory} from 'client/domain/item';
import {ComptoirrRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/searchResult';

export class ItemClient {
    private static serviceUrl:string = "http://somewhere.com/item";

    private getItemUrl(id:number) {
        return ItemClient.serviceUrl + "/" + id;
    }

    getItem(id:number, authToken: string):Promise<Item> {
        var thisClient = this;
        var url = this.getItemUrl(id);
        var request = new ComptoirrRequest();
        return request.get(url, authToken)
            .then(function (response) {
                var item = ItemFactory.buildItemFromJSON(response.json);
                return item;
            });
    }

    searchItems(search:ItemSearch, authToken: string):Promise<SearchResult<Item>> {
        var thisClient = this;
        var url = ItemClient.serviceUrl + '/search';
        var searchJSON = JSON.stringify(search);
        var request = new ComptoirrRequest();
        return request.post(searchJSON, url, authToken)
            .then(function (response) {
                var result = new SearchResult<Item>().parseResponse(response, ItemFactory.buildItemFromJSON);
                return result;
            });
    }

    createIem(item:Item, authToken: string):Promise<ItemRef> {
        var thisClient = this;
        var url = ItemClient.serviceUrl;
        var employeeJSON = JSON.stringify(item);
        var request = new ComptoirrRequest();
        return request.post(employeeJSON, url, authToken)
            .then(function (response) {
                var itemRef = ItemFactory.buildItemRefFromJSON(response.json);
                return itemRef;
            });
    }

    updateItem(item:Item, authToken: string):Promise<ItemRef> {
        var thisClient = this;
        var url = this.getItemUrl(item.id);
        var employeeJSON = JSON.stringify(item);
        var request = new ComptoirrRequest();
        return request.put(employeeJSON, url, authToken)
            .then(function (response) {
                var itemRef = ItemFactory.buildItemRefFromJSON(response.json);
                return itemRef;
            });
    }
}