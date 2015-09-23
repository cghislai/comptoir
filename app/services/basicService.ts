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
                if (entity == null) {
                    return null;
                }
                return this.serviceInfo.toLocalConverter(entity, authToken);
            });
    }

    save(localEntity:U):Promise<WithId> {
        var newEntity = localEntity.id == null;
        var authToken = this.authService.authToken;
        var entity = this.serviceInfo.fromLocalConverter(localEntity);

        var nextTask:Promise<WithId> = Promise.resolve(null);
        if (newEntity) {
            nextTask = this.client.create(entity, authToken);
        } else {
            nextTask = this.client.update(entity, authToken);
        }
        return nextTask;
    }

    remove(entity:U):Promise<any> {
        var authToken = this.authService.authToken;
        return this.client.remove(entity.id, authToken);
    }

    search(searchRequest:SearchRequest<U>, existingResult?:SearchResult<U>):Promise<SearchResult<U>> {
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
                if (existingResult) {
                    searchRequest.request = null;
                    return this.updateResult(existingResult, result);
                }
                var taskList = [];
                var localResult = new SearchResult<U>();
                localResult.count = result.count;
                localResult.list = [];

                // Keep track of result order
                for (var index in result.list) {
                    var entity = result.list[index];
                    taskList.push(
                        this.fetchLocalEntityForListIndex(index, entity, localResult.list)
                    );
                }
                return Promise.all(taskList)
                    .then(()=> {
                        searchRequest.request = null;
                        return localResult;
                    });
            });
    }

    fetchLocalEntityForListIndex(index: number, entity: T, list: U[]): Promise<U> {
        var authToken = this.authService.authToken;
        return this.serviceInfo.toLocalConverter(entity, authToken)
            .then((localEntity:U)=> {
                list[index] = localEntity;
                return localEntity;
            });
    }

    updateLocalEntityForListIndex(index: number, localEntity: U, entity: T, list: U[]): Promise<U> {
        var authToken = this.authService.authToken;
        return this.serviceInfo.updateLocal(localEntity, entity, authToken)
            .then((localEntity:U)=> {
                list[index] = localEntity;
                return localEntity;
            });
    }

    updateResult(result:SearchResult<U>, newResult:SearchResult<T>):Promise<SearchResult<U>> {
        var taskList = [];
        var authToken = this.authService.authToken;

        var newItems = [];
        var existingItemMap = {};
        for (var item of result.list) {
            existingItemMap[item.id] = item;
        }
        // Keep track of result order
        for (var newIndex in newResult.list) {
            var newItem = newResult.list[newIndex];
            var oldItem = existingItemMap[newItem.id];
            if (oldItem == null) {
                taskList.push(
                    this.fetchLocalEntityForListIndex(newIndex, newItem, newItems)
                );
                continue;
            }
            taskList.push(
                this.updateLocalEntityForListIndex(newIndex, oldItem, newItem, newItems)
            );
            delete existingItemMap[oldItem.id];
        }
        for (var removedId in existingItemMap) {

        }
        return Promise.all(taskList)
            .then(() => {
                result.count = newResult.count;
                result.list = newItems;
                return result;
            });
    }
}