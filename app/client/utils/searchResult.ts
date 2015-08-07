/**
 * Created by cghislai on 07/08/15.
 */
import {ComptoirResponse} from 'client/utils/request';

export class SearchResult<T> {

    count:number;
    list:T[];

    constructor() {

    }

    parseResponse(response:ComptoirResponse, factoryFunction:(json:any)=>T): SearchResult<T> {
        this.count = response.headers['COUNT'];
        this.list = [];
        for (var element of response.json) {
            var built:T = factoryFunction(element);
            this.list.push(built);
        }
        return this;
    }
}