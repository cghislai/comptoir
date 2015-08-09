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
    createIem(item:Item, authToken: string):Promise<ItemRef> {
        var url = ItemClient.serviceUrl;
        var request = new ComptoirrRequest();
        return request.post(item, url, authToken)
            .then(function (response) {
                var itemRef = JSON.parse(response.text);
                return itemRef;
            });
    }

    updateItem(item:Item, authToken: string):Promise<ItemRef> {
        var url = this.getItemUrl(item.id);
        var request = new ComptoirrRequest();
        return request.put(item, url, authToken)
            .then(function (response) {
                var itemRef = JSON.parse(response.text);
                return itemRef;
            });
    }
    getItem(id:number, authToken: string):Promise<Item> {
        var url = this.getItemUrl(id);
        var request = new ComptoirrRequest();
        return request.get(url, authToken)
            .then(function (response) {
                var item = JSON.parse(response.text, ItemFactory.fromJSONItemReviver);
                return item;
            });
    }

    searchItems(search:ItemSearch, authToken: string):Promise<SearchResult<Item>> {
        var url = ItemClient.serviceUrl + '/search';
        var request = new ComptoirrRequest();
        return request.post(search, url, authToken)
            .then(function (response) {
                var result = new SearchResult<Item>().parseResponse(response, ItemFactory.fromJSONItemReviver);
                return result;
            });
    }


}