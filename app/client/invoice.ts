/**
 * Created by cghislai on 15/01/16.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {Invoice, InvoiceFactory} from './domain/invoice';
import {CachedWSClient} from './utils/cachedWsClient';
import {COMPTOIR_SERVICE_URL} from '../config/service';

@Injectable()
export class InvoiceClient extends CachedWSClient<Invoice> {

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        super();
        this.http = http;
        this.resourcePath = '/invoice';
        this.webServiceUrl = serviceUrl;
        this.jsonReviver = InvoiceFactory.fromJSONReviver;
    }
}