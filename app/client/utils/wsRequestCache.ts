/**
 * Created by cghislai on 14/01/16.
 */

import {Request, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

import {WithId} from './withId';
import {ComptoirRequest} from './request';

export class WSRequestCache<T extends WithId> {

    getRequests:{[id: number]: Observable<Response>};

    constructor() {
        this.getRequests = {};
    }

    registerGetRequest(id:number, request:Observable<Response>) {
        this.getRequests[id] = request;
    }

    unRegisterGetRequest(id:number) {
        delete this.getRequests[id];
    }

    hasGetRequest(id:number):boolean {
        return this.getRequests[id] != null;
    }

    getGetRequest(id:number):Observable<Response> {
        if (!this.hasGetRequest(id)) {
            throw 'Invalid id';
        }
        return this.getRequests[id];
    }
}