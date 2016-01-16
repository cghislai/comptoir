/**
 * Created by cghislai on 15/01/16.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {AccountingTransaction, AccountingTransactionFactory} from './domain/accountingTransaction';
import {CachedWSClient} from './utils/cachedWsClient';
import {COMPTOIR_SERVICE_URL} from '../config/service';

@Injectable()
export class AccountingTransactionClient extends CachedWSClient<AccountingTransaction> {

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        super();
        this.http = http;
        this.resourcePath = '/accountingTransaction';
        this.webServiceUrl = serviceUrl;
        this.jsonReviver = AccountingTransactionFactory.fromJSONReviver;
    }
}