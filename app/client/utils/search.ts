/**
 * Created by cghislai on 11/08/15.
 */

import {ComptoirRequest, ComptoirResponse} from 'client/utils/request';
import {Pagination} from 'client/utils/pagination';

import {Map, List} from 'immutable';

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
    list:List<T>;

    constructor() {
        this.count = 0;
        this.list = List([]);
    }

    parseResponse(response:ComptoirResponse, jsonReviver:(key, value)=>any):SearchResult<T> {
        var list:T[] = JSON.parse(response.text, jsonReviver);
        var count = parseInt(response.listTotalCountHeader);
        if (isNaN(count)) {
            count = 0;
        }
        this.list = List(list);
        this.count = count;
        return this;
    }
}