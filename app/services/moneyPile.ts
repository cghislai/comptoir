/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/angular2';

import {LocalMoneyPile, LocalMoneyPileFactory} from '../client/localDomain/moneyPile';
import {MoneyPileClient, MoneyPile, MoneyPileRef, MoneyPileSearch} from '../client/domain/moneyPile';

import {BasicClient} from '../client/utils/basicClient';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {BasicLocalService, BasicLocalServiceInfo} from './basicService';
import {AuthService} from './auth';

export class MoneyPileService extends BasicLocalService<MoneyPile, LocalMoneyPile> {


    constructor(@Inject authService:AuthService) {
        var client = new MoneyPileClient();
        super(<BasicLocalServiceInfo<MoneyPile, LocalMoneyPile>>{
            client: client,
            authService: authService,
            fromLocalConverter: LocalMoneyPileFactory.fromLocalMoneyPile,
            toLocalConverter: LocalMoneyPileFactory.toLocalMoneyPile
        } );
    }

}