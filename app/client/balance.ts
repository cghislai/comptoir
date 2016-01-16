/**
 * Created by cghislai on 15/01/16.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {Balance, BalanceFactory} from './domain/balance';
import {CachedWSClient} from './utils/cachedWsClient';
import {COMPTOIR_SERVICE_URL} from '../config/service';

@Injectable()
export class BalanceClient extends CachedWSClient<Balance> {

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        super();
        this.http = http;
        this.resourcePath = '/balance';
        this.webServiceUrl = serviceUrl;
        this.jsonReviver = BalanceFactory.fromJSONReviver;
    }
}