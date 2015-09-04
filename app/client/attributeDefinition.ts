/**
 * Created by cghislai on 06/08/15.
 */


import {AttributeDefinition, AttributeDefinitionRef, AttributeDefinitionSearch, AttributeDefinitionFactory} from 'client/domain/attributeDefinition';
import {Pagination} from 'client/utils/pagination';
import {ComptoirRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/search';
import {ServiceConfig} from 'client/utils/service';


export class AttributeDefinitionClient {

    private static RESOURCE_PATH:string = "/attribute/definition";

    private getAttributeDefinitionUrl(id?:number) {
        var url = ServiceConfig.URL + AttributeDefinitionClient.RESOURCE_PATH;
        if (id != undefined) {
            url += "/" + id;
        }
        return url;
    }

    private getSearchUrl(pagination:Pagination) {
        var url = ServiceConfig.URL + AttributeDefinitionClient.RESOURCE_PATH;
        url += '/search';
        if (pagination != null) {
            url += '?offset=';
            url += pagination.firstIndex;
            url += "&length=";
            url += pagination.pageSize;
        }
        return url;
    }

    createAttributeDefinition(attributeDefinition:AttributeDefinition, authToken:string):Promise<AttributeDefinitionRef> {
        var request = new ComptoirRequest();
        var url = this.getAttributeDefinitionUrl();

        return request
            .post(attributeDefinition, url, authToken)
            .then(function (response) {
                var attributeDefinitionRef = JSON.parse(response.text);
                return attributeDefinitionRef;
            })
    }

    updateAttributeDefinition(attributeDefinition:AttributeDefinition, authToken:string):Promise<AttributeDefinitionRef> {
        var request = new ComptoirRequest();
        var url = this.getAttributeDefinitionUrl(attributeDefinition.id);

        return request
            .put(attributeDefinition, url, authToken)
            .then(function (response) {
                var attributeDefinitionRef = JSON.parse(response.text);
                return attributeDefinitionRef;
            });
    }

    getAttributeDefinition(id:number, authToken:string):Promise<AttributeDefinition> {
        var request = new ComptoirRequest();
        var url = this.getAttributeDefinitionUrl(id);

        return request
            .get(url, authToken)
            .then(function (response) {
                var attributeDefinition = JSON.parse(response.text, AttributeDefinitionFactory.fromJSONAttributeDefinitionReviver);
                return attributeDefinition;
            });
    }

    getGetAttributeDefinitionRequest(id:number, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getAttributeDefinitionUrl(id);
        request.setup('GET', url, authToken);
        return request;
    }

    searchAttributeDefinitions(search:AttributeDefinitionSearch, pagination:Pagination, authToken:string):Promise<SearchResult<AttributeDefinition>> {
        var request = new ComptoirRequest();
        var url = this.getSearchUrl(pagination);

        return request
            .post(search, url, authToken)
            .then(function (response) {
                var result = new SearchResult<AttributeDefinition>().parseResponse(response, AttributeDefinitionFactory.fromJSONAttributeDefinitionReviver);
                return result;
            });
    }
}