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


    createItemPicture(itemPicture:ItemPicture, authToken: string):Promise<ItemPictureRef> {
        var url = ItemPictureClient.serviceUrl;
        var request = new ComptoirrRequest();
        return request.post(itemPicture, url, authToken)
            .then(function (response) {
                var itemPictureRef = JSON.parse(response.text);
                return itemPictureRef;
            });
    }

    updateItemPicture(itemPicture:ItemPicture, authToken: string):Promise<ItemPictureRef> {
        var url = this.getItemPictureUrl(itemPicture.id);
        var request = new ComptoirrRequest();
        return request.put(itemPicture, url, authToken)
            .then(function (response) {
                var itemPictureRef = JSON.parse(response.text);
                return itemPictureRef;
            });
    }

    getItemPicture(id:number, authToken: string):Promise<ItemPicture> {
        var url = this.getItemPictureUrl(id);
        var request = new ComptoirrRequest();
        return request.get(url, authToken)
            .then(function (response) {
                var itemPicture = JSON.parse(response.text, ItemPictureFactory.fromJSONPictureReviver);
                return itemPicture;
            });
    }

    searchItemPicture(search:ItemPictureSearch, authToken: string):Promise<SearchResult<ItemPicture>> {
        var url = ItemPictureClient.serviceUrl + '/search';
        var request = new ComptoirrRequest();
        return request.post(search, url, authToken)
            .then(function (response) {
                var result = new SearchResult<ItemPicture>().parseResponse(response, ItemPictureFactory.fromJSONPictureReviver);
                return result;
            });
    }

}