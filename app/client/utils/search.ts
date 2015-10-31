/**
 * Created by cghislai on 11/08/15.
 */

import {ComptoirRequest, ComptoirResponse} from './request';
import {Pagination} from './pagination';

import * as Immutable from 'immutable';

export class SearchRequest<T> {
    search:any;
    pagination:Pagination;
    busy:boolean;
    private request:ComptoirRequest;

    discardRequest() {
        if (this.request == null) {
            return;
        }
        this.request.discardRequest();
        this.request = null;
    }

    setRequest(request:ComptoirRequest) {
        this.request = request;
    }
}
export class SearchResult<T> {

    count:number;
    list:Immutable.List<T>;

    constructor() {
        this.count = 0;
        this.list = Immutable.List([]);
    }

    parseResponse(response:ComptoirResponse, jsonReviver:(key, value)=>any):SearchResult<T> {
        var list:T[] = JSON.parse(response.text, jsonReviver);
        var count = parseInt(response.listTotalCountHeader);
        if (isNaN(count)) {
            count = 0;
        }
        this.list = Immutable.List(list);
        this.count = count;
        return this;
    }
}