/**
 * Created by cghislai on 29/07/15.
 */

import {Inject} from 'angular2/angular2';

import {AccountingEntry, AccountingEntryRef, AccountingEntryClient, AccountingEntryFactory} from '../client/domain/accountingEntry';
import {LocalAccountingEntry, LocalAccountingEntryFactory} from '../client/localDomain/accountingEntry';

import {BasicClient} from '../client/utils/basicClient';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {BasicLocalService, BasicLocalServiceInfo} from './basicService';
import {AuthService} from './auth';


export class AccountingEntryService extends BasicLocalService<AccountingEntry, LocalAccountingEntry> {

    constructor(@Inject(AuthService) authService:AuthService) {
        var client = new AccountingEntryClient();
        super(<BasicLocalServiceInfo<AccountingEntry, LocalAccountingEntry>>{
            client: client,
            authService: authService,
            fromLocalConverter: LocalAccountingEntryFactory.fromLocalAccountingEntry,
            toLocalConverter: LocalAccountingEntryFactory.toLocalAccountingEntry
        } );
    }
}