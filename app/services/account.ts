/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/angular2';

import {LocalAccount, LocalAccountFactory} from '../client/localDomain/account';
import {AccountClient, Account, AccountType, AccountRef, AccountSearch} from '../client/domain/account';

import {BasicClient} from '../client/utils/basicClient';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {BasicLocalService, BasicLocalServiceInfo} from './basicService';
import {AuthService} from './auth';

export class AccountService extends BasicLocalService<Account, LocalAccount> {

    lastUsedBalanceAccount:LocalAccount;

    constructor(@Inject authService:AuthService) {
        var client = new AccountClient();
        super(<BasicLocalServiceInfo<Account, LocalAccount>>{
            client: client,
            authService: authService,
            fromLocalConverter: LocalAccountFactory.fromLocalAccount,
            toLocalConverter: LocalAccountFactory.toLocalAccount
        } );
    }

}