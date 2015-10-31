/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/angular2';

import {LocalItemVariantSale, LocalItemVariantSaleFactory} from '../client/localDomain/itemVariantSale';
import {ItemVariantSaleClient, ItemVariantSale, ItemVariantSaleRef, ItemVariantSaleSearch} from '../client/domain/itemVariantSale';

import {BasicClient} from '../client/utils/basicClient';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {BasicLocalService, BasicLocalServiceInfo} from './basicService';
import {AuthService} from './auth';

export class ItemVariantSaleService extends BasicLocalService<ItemVariantSale, LocalItemVariantSale> {


    constructor(@Inject(AuthService) authService:AuthService) {
        var client = new ItemVariantSaleClient();
        super(<BasicLocalServiceInfo<ItemVariantSale, LocalItemVariantSale>>{
            client: client,
            authService: authService,
            fromLocalConverter: LocalItemVariantSaleFactory.fromLocalItemVariantSale,
            toLocalConverter: LocalItemVariantSaleFactory.toLocalItemVariantSale
        } );
    }

}