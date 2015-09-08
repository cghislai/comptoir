/**
 * Created by cghislai on 07/09/15.
 */

import {ServiceConfig} from 'client/utils/service';
import {Pagination} from 'client/utils/pagination';
import {ComptoirRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/search';


export interface WithId {
    id: number;
}
export interface BasicClientResourceInfo<T> {
    resourcePath: string;
    jsonReviver: (key, value)=>any;
    cache: {[id:number]: T};
}
export class BasicClient<T extends WithId> {
    protected resourceInfo:BasicClientResourceInfo<T>;

    constructor(resourceInfo:BasicClientResourceInfo<T>) {
        this.resourceInfo = resourceInfo;
    }

    protected getResourceUrl(id?:number) {
        var url = ServiceConfig.URL + this.resourceInfo.resourcePath;
        if (id != undefined) {
            url += "/" + id;
        }
        return url;
    }

    protected getSearchUrl(pagination:Pagination) {
        var url = ServiceConfig.URL + this.resourceInfo.resourcePath;
        url += '/search';
        if (pagination != null) {
            url += '?offset=';
            url += pagination.firstIndex;
            url += "&length=";
            url += pagination.pageSize;
        }
        return url;
    }

    getFromCacheOrServer(id: number, authToken:string) : Promise<T> {
        var entityFromCache = this.resourceInfo.cache[id];
        if (entityFromCache != null) {
            return Promise.resolve(entityFromCache);
        } else {
            return this.get(id, authToken);
        }
    }

    getCreateRequest(entity:T, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getResourceUrl();
        request.setup('POST', url, authToken);
        request.setupData(entity);
        return request;
    }

    create(entity:T, authToken:string):Promise<WithId> {
        var request = this.getCreateRequest(entity, authToken);
        return request
            .run()
            .then(function (response) {
                var ref:WithId = JSON.parse(response.text);
                return ref;
            });
    }

    getGetRequest(id:number, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getResourceUrl(id);
        request.setup('GET', url, authToken);
        return request;
    }

    get(id:number, authToken:string):Promise<T> {
        var request = this.getGetRequest(id, authToken);
        var reviver = this.resourceInfo.jsonReviver;
        return request
            .run()
            .then(function (response) {
                var entity:T = JSON.parse(response.text, reviver);
                if (this.resourceInfo.cache != null) {
                    this.resourceInfo.cache[id] = entity;
                }
                return entity;
            });
    }

    getUpdateRequest(entity:T, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getResourceUrl(entity.id);
        request.setup('PUT', url, authToken);
        request.setupData(entity);
        return request;
    }

    update(entity:T, authToken:string):Promise<WithId> {
        var request = this.getUpdateRequest(entity, authToken);
        var reviver = this.resourceInfo.jsonReviver;
        return request
            .run()
            .then(function (response) {
                var entity:T = JSON.parse(response.text, reviver);
                return entity;
            });
    }

    getSearchRequest(search:any, pagination:Pagination, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getSearchUrl(pagination);
        request.setup('POST', url, authToken);
        request.setupData(search);
        return request;
    }

    search(search:any, pagination:Pagination, authToken:string):Promise<SearchResult<T>> {
        var request = this.getSearchRequest(search, pagination, authToken);
        var reviver = this.resourceInfo.jsonReviver;
        return request
            .run()
            .then((response)=> {
                var result = new SearchResult<T>().parseResponse(response, reviver);
                return result;
            });
    }

    getRemoveRequest(id:number, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getResourceUrl(id);
        request.setup('DELETE', url, authToken);
        return request;
    }

    remove(id:number, authToken:string):Promise<any> {
        var request = this.getRemoveRequest(id, authToken);
        return request.run();
    }
}