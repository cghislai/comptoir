/**
 * Created by cghislai on 07/08/15.
 */
import {ComptoirResponse} from 'client/utils/request';

export class SearchResult<T> {

    static HEADER_TOTAL_COUT='X-Comptoir-ListTotalCount';
    count:number;
    list:T[];

    constructor() {

    }

    parseResponse(response:ComptoirResponse, jsonReviver:(key, value)=>any): SearchResult<T> {
        this.count = response.headers[SearchResult.HEADER_TOTAL_COUT];
        var list: T[] = JSON.parse(response.text, jsonReviver);
        var count =response.headers[SearchResult.HEADER_TOTAL_COUT];
        var result = new SearchResult<T>();
        result.list = list;
        result.count = count;
        return result;
    }
}