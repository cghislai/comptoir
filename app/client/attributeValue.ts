/**
 * Created by cghislai on 06/08/15.
 */


import {AttributeValue, AttributeValueRef,  AttributeValueFactory} from 'client/domain/attributeValue';
import {Pagination} from 'client/utils/pagination';
import {ComptoirRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/search';
import {ServiceConfig} from 'client/utils/service';


export class AttributeValueClient {

    private static RESOURCE_PATH:string = "/attribute/definition";

    private getAttributeValueUrl(id?:number) {
        var url = ServiceConfig.URL + AttributeValueClient.RESOURCE_PATH;
        if (id != undefined) {
            url += "/" + id;
        }
        return url;
    }

    private getSearchUrl(pagination:Pagination) {
        var url = ServiceConfig.URL + AttributeValueClient.RESOURCE_PATH;
        url += '/search';
        if (pagination != null) {
            url += '?offset=';
            url += pagination.firstIndex;
            url += "&length=";
            url += pagination.pageSize;
        }
        return url;
    }

    createAttributeValue(attributeValue:AttributeValue, authToken:string):Promise<AttributeValueRef> {
        var request = new ComptoirRequest();
        var url = this.getAttributeValueUrl();

        return request
            .post(attributeValue, url, authToken)
            .then(function (response) {
                var attributeValueRef = JSON.parse(response.text);
                return attributeValueRef;
            })
    }

    updateAttributeValue(attributeValue:AttributeValue, authToken:string):Promise<AttributeValueRef> {
        var request = new ComptoirRequest();
        var url = this.getAttributeValueUrl(attributeValue.id);

        return request
            .put(attributeValue, url, authToken)
            .then(function (response) {
                var attributeValueRef = JSON.parse(response.text);
                return attributeValueRef;
            });
    }

    getAttributeValue(id:number, authToken:string):Promise<AttributeValue> {
        var request = new ComptoirRequest();
        var url = this.getAttributeValueUrl(id);

        return request
            .get(url, authToken)
            .then(function (response) {
                var attributeValue = JSON.parse(response.text, AttributeValueFactory.fromJSONAttributeValueReviver);
                return attributeValue;
            });
    }

    getGetAttributeValueRequest(id:number, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getAttributeValueUrl(id);
        request.setup('GET', url, authToken);
        return request;
    }
}