/**
 * Created by cghislai on 15/01/16.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {Company, CompanyFactory} from './domain/company';
import {CachedWSClient} from './utils/cachedWsClient';
import {COMPTOIR_SERVICE_URL} from '../config/service';

@Injectable()
export class CompanyClient extends CachedWSClient<Company> {

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        super();
        this.http = http;
        this.resourcePath = '/company';
        this.webServiceUrl = serviceUrl;
        this.jsonReviver = CompanyFactory.fromJSONReviver;
    }
}