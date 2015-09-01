/**
 * Created by cghislai on 07/08/15.
 */

import {ItemPicture, ItemPictureRef, ItemPictureSearch, ItemPictureFactory} from 'client/domain/itemPicture';
import {ComptoirRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/search';
import {ServiceConfig} from 'client/utils/service';
import {Pagination} from'client/utils/pagination';

export class ItemPictureClient {
    private static serviceUrl:string = "http://somewhere.com/itemPicture";

    private getResourceUrl(itemPicture: ItemPicture) : string {
        var itemId = itemPicture.itemVariantRef.id;
        var url = ServiceConfig.URL;
        url += "/item";
        url += "/"+itemId;
        url += "/picture";
        if (itemPicture.id != null) {
            url += "/" + itemPicture.id;
        }
        return url;
    }

    private getItemPictureUrl(itemId: number, pictureId: number) {
        var url = ServiceConfig.URL;
        url += "/item";
        url += "/"+itemId;
        url += "/picture";
        url += "/" + pictureId;
        return url;
    }

    private getItemPictureSearchUrl(itemId: number, pagination:Pagination) {
        var url = ServiceConfig.URL;
        url += "/item";
        url += "/"+itemId;
        url += "/picture";
        url += "/search";
        return url;
    }


    createItemPicture(itemPicture:ItemPicture, authToken: string):Promise<ItemPictureRef> {
        var url = this.getResourceUrl(itemPicture);
        var request = new ComptoirRequest();
        return request.post(itemPicture, url, authToken)
            .then(function (response) {
                var itemPictureRef = JSON.parse(response.text);
                return itemPictureRef;
            });
    }

    updateItemPicture(itemPicture:ItemPicture, authToken: string):Promise<ItemPictureRef> {
        var url = this.getResourceUrl(itemPicture);
        var request = new ComptoirRequest();
        return request.put(itemPicture, url, authToken)
            .then(function (response) {
                var itemPictureRef = JSON.parse(response.text);
                return itemPictureRef;
            });
    }

    getItemPicture(itemId: number, id:number, authToken: string):Promise<ItemPicture> {
        var url = this.getItemPictureUrl(itemId, id);
        var request = new ComptoirRequest();
        return request.get(url, authToken)
            .then(function (response) {
                var itemPicture = JSON.parse(response.text, ItemPictureFactory.fromJSONPictureReviver);
                return itemPicture;
            });
    }

    searchItemPicture(itemId: number, pagination: Pagination, authToken: string):Promise<SearchResult<ItemPicture>> {
        var url = this.getItemPictureSearchUrl(itemId, pagination);
        var request = new ComptoirRequest();
        return request.get(url, authToken)
            .then(function (response) {
                var result = new SearchResult<ItemPicture>().parseResponse(response, ItemPictureFactory.fromJSONPictureReviver);
                return result;
            });
    }

}