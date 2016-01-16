/**
 * Created by cghislai on 14/01/16.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Request, RequestOptions, Response, URLSearchParams} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import * as Immutable from 'immutable';

import {WithId} from './withId';
import {JSONFactory} from './factory';
import {Cancellation} from './cancellation';
import {Pagination} from './pagination';
import {SearchRequest, SearchResult} from './search';
import {ComptoirRequest, ComptoirResponse, ComptoirError} from './request';
import {WSClient, WsUtils} from './wsClient';
import {WSResourceCache, WSResourceMemoryCache} from './wsResourceCache';
import {WSRequestCache} from './wsRequestCache';


export class CachedWSClient<T extends WithId> implements WSClient<T> {

    resourcePath:string;
    webServiceUrl:string;
    http:Http;
    jsonReviver:(key, value)=>any;

    private resourceCache:WSResourceCache<T>;
    private requestCache:WSRequestCache<T>;

    constructor() {
        this.resourceCache = new WSResourceMemoryCache<T>();
        this.requestCache = new WSRequestCache<T>();
    }

    protected createSearchParams(pagination:Pagination):URLSearchParams {
        var searchParams:URLSearchParams = new URLSearchParams();
        if (pagination != null) {
            searchParams.append('offset', pagination.firstIndex.toString());
            searchParams.append('length', pagination.pageSize.toString());
            if (pagination.sorts != null) {
                var sortParams:string[] = [];
                for (var column in pagination.sorts) {
                    var param = column;
                    param += "-";
                    param += pagination.sorts[column];
                    sortParams.push(param);
                }
                searchParams.paramsMap.set('sort', sortParams);
            }
        }
        return searchParams;
    }


    doFetch(id:number, authToken:string, cancellation?:Cancellation):Observable<T> {
        this.resourceCache.clearId(id);
        return this.doGet(id, authToken, cancellation);
    }

    doGet(id:number, authToken:string, cancellation?:Cancellation):Observable<T> {
        if (this.resourceCache.contains(id)) {
            var entity:T = this.resourceCache.getFromCache(id);
            return Observable.of(entity);
        }
        var request:Observable<Response>;
        if (this.requestCache.hasGetRequest(id)) {
            request = this.requestCache.getGetRequest(id);
        } else {
            var url = this.webServiceUrl + this.resourcePath + '/' + id;
            var options = WsUtils.getRequestOptions(authToken);
            options.method = 'GET';
            options.url = url;
            request = this.http.request(new Request(options));

            this.requestCache.registerGetRequest(id, request);
            this.handleCancelRequest(request, cancellation);
        }

        return request
            .map((response:Response)=> {
                return <T> JSON.parse(response.text(), this.jsonReviver);
            })
            .do((entity:T)=> {
                this.resourceCache.putInCache(entity);
                this.requestCache.unRegisterGetRequest(id);
            });
    }

    doRemove(id:number, authToken:string, cancellation?:Cancellation):Observable<any> {
        var url = this.webServiceUrl + this.resourcePath + '/' + id;
        var options = WsUtils.getRequestOptions(authToken);
        options.method = 'DELETE';
        options.url = url;
        var request = this.http.request(new Request(options));

        // TODO: cancel ongoing GET requests
        request.subscribe(()=> {
            this.resourceCache.clearId(id);
        });
        return request;
    }

    doCreate(entity:T, authToken:string, cancellation?:Cancellation):Observable<WithId> {
        var url = this.webServiceUrl + this.resourcePath;
        var options = WsUtils.getRequestOptions(authToken);
        options.method = 'POST';
        options.url = url;
        options.body = JSON.stringify(entity, JSONFactory.toJSONReplacer);
        var request = this.http.request(new Request(options));

        return request
            .map((response:Response)=> {
                return <WithId>response.json();
            });
    }

    doUpdate(entity:T, authToken:string, cancellation?:Cancellation):Observable<WithId> {
        var url = this.webServiceUrl + this.resourcePath + '/' + entity.id;
        var options = WsUtils.getRequestOptions(authToken);
        options.method = 'PUT';
        options.url = url;
        options.body = JSON.stringify(entity, JSONFactory.toJSONReplacer);
        var request = this.http.request(new Request(options));

        // TODO: cancel ongoing get requests?
        request.subscribe(()=> {
            this.resourceCache.clearId(entity.id);
        });
        return request
            .map((response:Response)=> {
                return <WithId>response.json();
            });
    }

    doSave(entity:T, authToken:string, cancellation?:Cancellation):Observable<WithId> {
        if (entity.id == null) {
            return this.doCreate(entity, authToken, cancellation);
        } else {
            return this.doUpdate(entity, authToken, cancellation);
        }
    }

    doSearch(searchRequest:SearchRequest<T>, authToken:string, cancellation?:Cancellation):Observable<SearchResult<T>> {
        var url = this.webServiceUrl + this.resourcePath + '/search';
        var options = WsUtils.getRequestOptions(authToken);
        options.method = 'POST';
        options.url = url;
        options.search = this.createSearchParams(searchRequest.pagination);
        options.body = JSON.stringify(searchRequest.search, JSONFactory.toJSONReplacer);
        var request = this.http.request(new Request(options));
        searchRequest.busy = true;
        return request
            .map((response:Response)=> {
                var list:T[] = JSON.parse(response.text(), this.jsonReviver);
                var count:number = parseInt(response.headers.get(WsUtils.HEADER_TOTAL_COUNT));
                var result:SearchResult<T> = new SearchResult<T>();
                result.count = isNaN(count) ? 0 : count;
                result.list = Immutable.List<T>(list);
                searchRequest.busy = false;
                return result;
            });
    }

    private handleCancelRequest(request:Observable<Response>, cancellation?:Cancellation) {
        if (!cancellation) {
            return;
        }
        // TODO!
        var subscription = cancellation.onCancel.subscribe(()=> {
            //request.discardRequest();
        });
        request.subscribe(()=> {
            subscription.unsubscribe();
        });
    }
}