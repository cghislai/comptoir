/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/angular2';

import {LocalBalance, LocalBalanceFactory} from 'client/localDomain/balance';
import {BalanceClient, Balance, BalanceRef, BalanceSearch} from 'client/domain/balance';

import {BasicClient} from 'client/utils/basicClient';
import {SearchRequest, SearchResult} from 'client/utils/search';

import {BasicLocalService, BasicLocalServiceInfo} from 'services/basicService';
import {AuthService} from 'services/auth';

export class BalanceService extends BasicLocalService<Balance, LocalBalance> {


    constructor(@Inject authService:AuthService) {
        var client:BasicClient<Balance> = new BalanceClient();
        super({
            client: client,
            authService: authService,
            fromLocalConverter: LocalBalanceFactory.fromLocalBalance,
            toLocalConverter: LocalBalanceFactory.toLocalBalance,
            updateLocal: LocalBalanceFactory.updateLocalBalance
        } );
    }

}