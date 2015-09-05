/**
 * Created by cghislai on 11/08/15.
 */

import {ComptoirResponse} from 'client/utils/request';

export class SearchResult<T> {

    count:number;
    list:T[];

    constructor() {
        this.count = 0;
        this.list = [];
    }

    parseResponse(response:ComptoirResponse, jsonReviver:(key, value)=>any): SearchResult<T> {
        var list: T[] = JSON.parse(response.text, jsonReviver);
        var count =parseInt(response.listTotalCountHeader);
        if (isNaN(count)) {
            count = 0;
        }
        this.list = list;
        this.count = count;
        return this;
    }
}