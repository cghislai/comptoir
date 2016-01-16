/**
 * Created by cghislai on 15/01/16.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {MoneyPile, MoneyPileFactory} from './domain/moneyPile';
import {CachedWSClient} from './utils/cachedWsClient';
import {COMPTOIR_SERVICE_URL} from '../config/service';

@Injectable()
export class MoneyPileClient extends CachedWSClient<MoneyPile> {

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        super();
        this.http = http;
        this.resourcePath = '/moneyPile';
        this.webServiceUrl = serviceUrl;
        this.jsonReviver = MoneyPileFactory.fromJSONReviver;
    }
}