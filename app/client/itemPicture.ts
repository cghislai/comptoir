/**
 * Created by cghislai on 07/08/15.
 */

import {ItemPicture, ItemPictureRef, ItemPictureSearch, ItemPictureFactory} from 'client/domain/itemPicture';
import {ComptoirrRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/searchResult';

export class ItemPictureClient {
    private static serviceUrl:string = "http://somewhere.com/itemPicture";

    private getItemPictureUrl(id:number) {
        return ItemPictureClient.serviceUrl + "/" + id;
    }

    getItemPicture(id:number, authToken: string):Promise<ItemPicture> {
        var thisClient = this;
        var url = this.getItemPictureUrl(id);
        var request = new ComptoirrRequest();
        return request.get(url, authToken)
            .then(function (response) {
                var itemPicture = ItemPictureFactory.buildItemPictureFromJSON(response.json);
                return itemPicture;
            });
    }

    removeItemPicture(picture: ItemPicture): Promise<any> {
        // TODO
        return Promise.resolve();
    }

    searchItemPicture(search:ItemPictureSearch, authToken: string):Promise<SearchResult<ItemPicture>> {
        var thisClient = this;
        var url = ItemPictureClient.serviceUrl + '/search';
        var searchJSON = JSON.stringify(search);
        var request = new ComptoirrRequest();
        return request.post(searchJSON, url, authToken)
            .then(function (response) {
                var result = new SearchResult<ItemPicture>().parseResponse(response, ItemPictureFactory.buildItemPictureFromJSON);
                return result;
            });
    }

    createItemPicture(itemPicture:ItemPicture, authToken: string):Promise<ItemPictureRef> {
        var thisClient = this;
        var url = ItemPictureClient.serviceUrl;
        var itemPictureJSON = JSON.stringify(itemPicture);
        var request = new ComptoirrRequest();
        return request.post(itemPictureJSON, url, authToken)
            .then(function (response) {
                var itemPictureRef = ItemPictureFactory.buildItemPictureRefFromJSON(response.json);
                return itemPictureRef;
            });
    }

    updateItemPicture(itemPicture:ItemPicture, authToken: string):Promise<ItemPictureRef> {
        var thisClient = this;
        var url = this.getItemPictureUrl(itemPicture.id);
        var itemPictureJSON = JSON.stringify(itemPicture);
        var request = new ComptoirrRequest();
        return request.put(itemPictureJSON, url, authToken)
            .then(function (response) {
                var itemPictureRef = ItemPictureFactory.buildItemPictureRefFromJSON(response.json);
                return itemPictureRef;
            });
    }
}