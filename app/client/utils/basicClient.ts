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

export class BasicCacheHandler<T extends WithId> {
    cache:{[id: number] : T} = {};
    requestCache:{[id: number] : ComptoirRequest} = {};
    getPromises:{[id: number] : Promise<T>} = {};

    putInCache(entity:T) {
        var id = entity.id;
        if (id == null) {
            throw 'no id';
        }
        this.cache[id] = entity;
    }

    getFromCache(id:number) {
        return this.cache[id];
    }

    clearFromCache(id:number) {
        delete this.cache[id];
    }

    clearCache() {
        this.cache = {};
    }

    cancelRequest(id: number) {
        var request = this.requestCache[id];
        if (request != null) {
            request.discardRequest();
        }
    }
    setRequest(id: number, request: ComptoirRequest) {
        this.requestCache[id] = request;
    }
    unsetRequest(id: number) {
        delete this.requestCache[id];
    }

    setGetPromise(id: number, promise: Promise<T>) {
        this.getPromises[id] = promise;
    }
    unsetGetPromise(id: number) {
        delete this.getPromises[id];
    }
}

export interface BasicClientResourceInfo<T extends WithId> {
    resourcePath: string;
    jsonReviver: (key, value)=>any;
    cacheHandler: BasicCacheHandler<T>;
}
export class BasicClient<T extends WithId> {
    resourceInfo:BasicClientResourceInfo<T>;

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
            if (pagination.sorts != null) {
                url += "&sort="
                for (var column in pagination.sorts) {
                    url += column;
                    url += "-"
                    url += pagination.sorts[column];
                }
            }
        }
        return url;
    }

    getFromCacheOrServer(id:number, authToken:string):Promise<T> {
        var entityFromCache = this.resourceInfo.cacheHandler.getFromCache(id);
        if (entityFromCache != null) {
            return Promise.resolve(entityFromCache);
        } else {
            var getPromise = this.resourceInfo.cacheHandler.getPromises[id];
            if (getPromise != null) {
                return getPromise;
            }
            return this.get(id, authToken);
        }
    }

    private getCreateRequest(entity:T, authToken:string):ComptoirRequest {
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
            .then((response) => {
                var ref:WithId = JSON.parse(response.text);
                return ref;
            });
    }

    private getGetRequest(id:number, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getResourceUrl(id);
        request.setup('GET', url, authToken);

        return request;
    }

    get(id:number, authToken:string):Promise<T> {
        var request = this.getGetRequest(id, authToken);
        var reviver = this.resourceInfo.jsonReviver;

        var getPromise = request
            .run()
            .then((response) => {
                if (response.text == null || response.text.length == 0) {
                    return null;
                }
                var entity:T = JSON.parse(response.text, reviver);
                this.resourceInfo.cacheHandler.putInCache(entity);
                this.resourceInfo.cacheHandler.unsetGetPromise(id);
                return entity;
            });
        this.resourceInfo.cacheHandler.setGetPromise(id, getPromise);
        return getPromise;
    }

    private getUpdateRequest(entity:T, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getResourceUrl(entity.id);
        request.setup('PUT', url, authToken);
        request.setupData(entity);

        return request;
    }

    update(entity:T, authToken:string):Promise<WithId> {
        var id = entity.id;
        this.resourceInfo.cacheHandler.cancelRequest(id);
        var request = this.getUpdateRequest(entity, authToken);
        var reviver = this.resourceInfo.jsonReviver;
        this.resourceInfo.cacheHandler.setRequest(id, request);

        return request
            .run()
            .then((response)=> {
                var entity:T = JSON.parse(response.text, reviver);
                this.resourceInfo.cacheHandler.unsetRequest(id);
                return entity;
            });
    }

    save(entity:T, authToken:string):Promise<WithId> {
        if (entity.id == null) {
            return this.create(entity, authToken);
        } else {
            return this.update(entity, authToken);
        }
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
                for (var entity of result.list) {
                    this.resourceInfo.cacheHandler.putInCache(entity);
                }
                return result;
            });
    }

    private getRemoveRequest(id:number, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getResourceUrl(id);
        request.setup('DELETE', url, authToken);
        return request;
    }

    remove(id:number, authToken:string):Promise<any> {
        this.resourceInfo.cacheHandler.cancelRequest(id);
        var request = this.getRemoveRequest(id, authToken);
        this.resourceInfo.cacheHandler.setRequest(id, request);
        return request.run().then(()=>{
            this.resourceInfo.cacheHandler.unsetRequest(id);
        });
    }

    private debugString(id:number) {
        var constructorString:string = this.constructor.toString();
        var className:string = constructorString.match(/\w+/g)[1];
        return '' + (className) + ' id:' + id;
    }
}