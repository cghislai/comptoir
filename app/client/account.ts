/**
 * Created by cghislai on 15/01/16.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {Account, AccountFactory} from './domain/account';
import {CachedWSClient} from './utils/cachedWsClient';
import {COMPTOIR_SERVICE_URL} from '../config/service';

@Injectable()
export class AccountClient extends CachedWSClient<Account> {

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        super();
        this.http = http;
        this.resourcePath = '/account';
        this.webServiceUrl = serviceUrl;
        this.jsonReviver = AccountFactory.fromJSONReviver;
    }
}