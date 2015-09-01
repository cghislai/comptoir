/**
 * Created by cghislai on 07/08/15.
 */

import {ItemVariant, ItemVariantRef, ItemVariantSearch, ItemVariantFactory} from 'client/domain/itemVariant';
import {ComptoirRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/search';
import {ServiceConfig} from 'client/utils/service';
import {Pagination} from'client/utils/pagination';

export class ItemClient {
    private static RESOURCE_PATH = "/item";

    private getResourceUrl():string {
        return ServiceConfig.URL + ItemClient.RESOURCE_PATH;
    }

    private getItemVariantUrl(id:number):string {
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


    createItemVariant(itemVariant:ItemVariant, authToken:string):Promise<ItemVariantRef> {
        var url = this.getResourceUrl();
        var request = new ComptoirRequest();
        return request.post(itemVariant, url, authToken)
            .then(function (response) {
                var itemRef = JSON.parse(response.text);
                return itemRef;
            });
    }

    updateItemvariant(itemVariant:ItemVariant, authToken:string):Promise<ItemVariantRef> {
        var url = this.getItemVariantUrl(itemVariant.id);
        var request = new ComptoirRequest();
        return request.put(itemVariant, url, authToken)
            .then(function (response) {
                var itemRef = JSON.parse(response.text);
                return itemRef;
            });
    }

    getItemVariant(id:number, authToken:string):Promise<ItemVariant> {
        var url = this.getItemVariantUrl(id);
        var request = new ComptoirRequest();
        return request.get(url, authToken)
            .then(function (response) {
                var item = JSON.parse(response.text, ItemVariantFactory.fromJSONItemReviver);
                return item;
            });
    }

    getGetItemVariantRequest(id:number, authToken:string):ComptoirRequest {
        var url = this.getItemVariantUrl(id);
        var request = new ComptoirRequest();
        request.setup('GET', url, authToken);
        return request;
    }

    searchItemVariants(search:ItemVariantSearch, pagination:Pagination, authToken:string):Promise<SearchResult<ItemVariant>> {
        var url = this.getSearchUrl(pagination);
        var request = new ComptoirRequest();
        return request.post(search, url, authToken)
            .then(function (response) {
                var result = new SearchResult<ItemVariant>().parseResponse(response, ItemVariantFactory.fromJSONItemReviver);
                return result;
            });
    }


}