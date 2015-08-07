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

    parseResponse(response:ComptoirResponse, factoryFunction:(json:any)=>T): SearchResult<T> {
        this.count = response.headers[SearchResult.HEADER_TOTAL_COUT];
        this.list = [];
        for (var element of response.json) {
            var built:T = factoryFunction(element);
            this.list.push(built);
        }
        return this;
    }
}