/**
 * Created by cghislai on 14/01/16.
 */
import { RequestOptions, Headers} from 'angular2/http';

import {Observable} from 'rxjs/Observable';

import {Cancellation} from './cancellation';
import {Pagination} from './pagination';
import {SearchRequest, SearchResult} from './search';
import {WithId} from './withId';

import {Account} from '../domain/account';


export class WsUtils {
    static REQUEST_TIMEOUT:number = 60000;
    static MIME_TYPE_JSON:string = 'application/json';
    static CHARSET_UTF8 = 'UTF-8';
    static HEADER_AUTHORIZATION = 'Authorization';
    static HEADER_TOTAL_COUNT = 'X-Comptoir-ListTotalCount';

    static getRequestOptions(authToken?:string):RequestOptions {
        var headers = new Headers();
        headers.append('Accept', WsUtils.MIME_TYPE_JSON);
        headers.append('Content-Type', WsUtils.MIME_TYPE_JSON + '; charset=' + WsUtils.CHARSET_UTF8);
        if (authToken != null) {
            headers.append(WsUtils.HEADER_AUTHORIZATION, authToken);
        }
        var options = new RequestOptions({
            headers: headers
        });
        return options;
    }
}

export interface WSClient<T extends WithId> {

    resourcePath: string;

    doGet(id:number, authToken?:string, cancellation?:Cancellation): Observable<T>;
    doRemove(id:number, authToken?:string, cancellation?:Cancellation): Observable<any>;
    doCreate(entity:T, authToken?:string, cancellation?:Cancellation): Observable<WithId>;
    doUpdate(entity:T, authToken?:string, cancellation?:Cancellation): Observable<WithId>;
    doSave(entity:T, authToken?:string, cancellation?:Cancellation): Observable<WithId>;
    doSearch(request:SearchRequest<T>, authToken?:string, cancellation?:Cancellation): Observable<SearchResult<T>>;


}

