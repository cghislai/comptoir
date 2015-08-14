/**
 * Created by cghislai on 14/08/15.
 */


import {Pos, PosRef, PosSearch, PosFactory} from 'client/domain/pos';
import {Pagination} from 'client/utils/pagination';
import {ComptoirrRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/search';
import {ServiceConfig} from 'client/utils/service';


export class PosClient {
    private static RESOURCE_PATH:string = "/pos";

    private getPosUrl(id?:number) {
        var url = ServiceConfig.URL + PosClient.RESOURCE_PATH;
        if (id != undefined) {
            url += "/" + id;
        }
        return url;
    }

    private getSearchUrl(pagination:Pagination) {
        var url = ServiceConfig.URL + PosClient.RESOURCE_PATH;
        url += '/search';
        if (pagination != null) {
            url += '?offset=';
            url += pagination.firstIndex;
            url += "&length=";
            url += pagination.pageSize;
            return url;
        }
        return url;
    }

    createPos(pos:Pos, authToken:string):Promise<PosRef> {
        var request = new ComptoirrRequest();
        var url = this.getPosUrl();

        return request
            .post(pos, url, authToken)
            .then(function (response) {
                var posRef = JSON.parse(response.text);
                return posRef;
            })
    }

    updatePos(pos:Pos, authToken:string):Promise<PosRef> {
        var request = new ComptoirrRequest();
        var url = this.getPosUrl(pos.id);

        return request
            .put(pos, url, authToken)
            .then(function (response) {
                var posRef = JSON.parse(response.text);
                return posRef;
            });
    }

    getPos(id:number, authToken:string):Promise<Pos> {
        var request = new ComptoirrRequest();
        var url = this.getPosUrl(id);

        return request
            .get(url, authToken)
            .then(function (response) {
                var pos = JSON.parse(response.text, PosFactory.fromJSONPosReviver);
                return pos;
            });
    }

    searchPos(search:PosSearch, pagination:Pagination, authToken:string):Promise<SearchResult<Pos>> {
        var request = new ComptoirrRequest();
        var url = this.getSearchUrl(pagination);

        return request
            .post(search, url, authToken)
            .then(function (response) {
                var result = new SearchResult<Pos>().parseResponse(response, PosFactory.fromJSONPosReviver);
                return result;
            });
    }
}