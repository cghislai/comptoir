/**
 * Created by cghislai on 29/07/15.
 */

import {Inject} from 'angular2/angular2';

import {AccountingEntry, AccountingEntryRef, AccountingEntryClient, AccountingEntryFactory} from 'client/domain/accountingEntry';
import {LocalAccountingEntry, LocalAccountingEntryFactory} from 'client/localDomain/accountingEntry';

import {BasicClient} from 'client/utils/basicClient';
import {SearchRequest, SearchResult} from 'client/utils/search';

import {BasicLocalService, BasicLocalServiceInfo} from 'services/basicService';
import {AuthService} from 'services/auth';


export class AccountingEntryService extends BasicLocalService<AccountingEntry, LocalAccountingEntry> {

    constructor(@Inject authService:AuthService) {
        var client = new AccountingEntryClient();
        super({
            client: client,
            authService: authService,
            fromLocalConverter: LocalAccountingEntryFactory.fromLocalAccountingEntry,
            toLocalConverter: LocalAccountingEntryFactory.toLocalAccountingEntry,
            updateLocal: LocalAccountingEntryFactory.updateLocalAccountingEntry
        } );
    }
}