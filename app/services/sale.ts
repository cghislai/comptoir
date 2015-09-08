/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/angular2';

import {LocalSale, LocalSaleFactory} from 'client/localDomain/sale';
import {SaleClient, Sale, SaleRef, SaleSearch} from 'client/domain/sale';

import {BasicClient} from 'client/utils/basicClient';
import {SearchRequest, SearchResult} from 'client/utils/search';

import {BasicLocalService, BasicLocalServiceInfo} from 'services/basicService';
import {AuthService} from 'services/auth';

export class SaleService extends BasicLocalService<Sale, LocalSale> {

    activeSale:LocalSale;

    constructor(@Inject authService:AuthService) {
        var client:BasicClient<Sale> = new SaleClient();
        super({
            client: client,
            authService: authService,
            fromLocalConverter: LocalSaleFactory.fromLocalSale,
            toLocalConverter: LocalSaleFactory.toLocalSale,
            updateLocal: LocalSaleFactory.updateLocalSale
        });
    }

}