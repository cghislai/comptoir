/**
 * Created by cghislai on 08/09/15.
 */

import {WithId, BasicClient} from 'client/utils/basicClient';
import {SearchRequest, SearchResult} from 'client/utils/search';
import {ComptoirResponse} from 'client/utils/request';

import {AuthService} from 'services/auth';


export class BasicServiceInfo<T extends WithId> {
    client:BasicClient<T>;
    authService:AuthService;
}
export class BasicLocalServiceInfo<T extends WithId, U extends WithId> extends BasicServiceInfo<T> {
    fromLocalConverter:(U)=>T;
    toLocalConverter:(T, string)=>Promise<U>;
    updateLocal:(U, T, string)=>Promise<U>;
}

export class BasicService<T extends WithId> {
    client:BasicClient<T>;
    authService:AuthService;

    constructor(info:BasicServiceInfo<T>) {
        this.client = info.client;
        this.authService = info.authService;
    }

    get(id:number):Promise<T> {
        var authToken = this.authService.authToken;
        return this.client.get(id, authToken);
    }

    save(entity:T):Promise<T> {
        var newEntity = entity.id == null;
        var authToken = this.authService.authToken;

        var nextTask:Promise<WithId> = Promise.resolve(null);
        if (newEntity) {
            nextTask = this.client.create(entity, authToken);
        } else {
            nextTask = this.client.update(entity, authToken);
        }
        return nextTask.then((ref:WithId)=> {
            this.client.resourceInfo.cacheHandler.clearFromCache(ref.id);
            return this.get(ref.id)
        });
    }

    refresh(entity:T):Promise<T> {
        this.client.resourceInfo.cacheHandler.clearFromCache(entity.id);
        return this.get(entity.id);
    }

    remove(entity:T):Promise<any> {
        var authToken = this.authService.authToken;
        return this.client.remove(entity.id, authToken);
    }

    search(searchRequest:SearchRequest<T>):Promise<SearchResult<T>> {
        if (searchRequest.request != null) {
            searchRequest.request.discardRequest();
        }
        var authToken = this.authService.authToken;
        var request = this.client.getSearchRequest(searchRequest.search, searchRequest.pagination, authToken);
        searchRequest.request = request;
        return request.run()
            .then((response:ComptoirResponse)=> {
                var result:SearchResult<T> = new SearchResult<T>();
                result.parseResponse(response, this.client.resourceInfo.jsonReviver);
                return result;
            }).then((result:SearchResult<T>)=> {
                searchRequest.request = null;
                return result;
            });
    }
}


export class BasicLocalService<T extends WithId, U extends WithId> {
    client:BasicClient<T>;
    authService:AuthService;
    serviceInfo:BasicLocalServiceInfo<T, U>;

    constructor(info:BasicLocalServiceInfo<T, U>) {
        this.client = info.client;
        this.authService = info.authService;
        this.serviceInfo = info;
    }

    get(id:number):Promise<U> {
        var authToken = this.authService.authToken;
        return this.client.get(id, authToken)
            .then((entity:T) => {
                return this.serviceInfo.toLocalConverter(entity, authToken);
            });
    }

    save(localEntity:U):Promise<U> {
        var newEntity = localEntity.id == null;
        var authToken = this.authService.authToken;
        var entity = this.serviceInfo.fromLocalConverter(localEntity);

        var nextTask:Promise<WithId> = Promise.resolve(null);
        if (newEntity) {
            nextTask = this.client.create(entity, authToken);
        } else {
            nextTask = this.client.update(entity, authToken);
        }
        return nextTask.then((ref:WithId)=> {
            this.client.resourceInfo.cacheHandler.clearFromCache(ref.id);
            return this.get(ref.id)
        });
    }

    refresh(entity:U):Promise<U> {
        this.client.resourceInfo.cacheHandler.clearFromCache(entity.id);
        return this.get(entity.id);
    }

    remove(entity:U):Promise<any> {
        var authToken = this.authService.authToken;
        return this.client.remove(entity.id, authToken);
    }

    search(searchRequest:SearchRequest<U>):Promise<SearchResult<U>> {
        if (searchRequest.request != null) {
            searchRequest.request.discardRequest();
        }
        var authToken = this.authService.authToken;
        var request = this.client.getSearchRequest(searchRequest.search, searchRequest.pagination, authToken);
        searchRequest.request = request;
        return request.run()
            .then((response:ComptoirResponse)=> {
                var result:SearchResult<T> = new SearchResult<T>();
                result.parseResponse(response, this.client.resourceInfo.jsonReviver);
                return result;
            }).then((result:SearchResult<T>)=> {
                var taskList = [];
                var localResult = new SearchResult<U>();
                localResult.count = result.count;
                localResult.list = [];
                for (var entity of result.list) {
                    taskList.push(
                        this.serviceInfo.toLocalConverter(entity, authToken)
                    );
                }
                return Promise.all(taskList)
                    .then(()=> {
                        searchRequest.request = null;
                        return localResult;
                    });
            });
    }
}