/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/angular2';

import {LocalSale, LocalSaleFactory} from '../client/localDomain/sale';
import {LocalItemVariant} from '../client/localDomain/itemVariant';
import {LocalItemVariantSale, LocalItemVariantSaleFactory} from '../client/localDomain/itemVariantSale';

import {CompanyRef} from '../client/domain/company';
import {SaleClient, Sale, SaleRef, SaleSearch} from '../client/domain/sale';
import {ItemVariantRef} from '../client/domain/itemVariant';
import {ItemVariantSale, ItemVariantSaleRef, ItemVariantSaleClient, ItemVariantSaleFactory, ItemVariantSaleSearch} from '../client/domain/itemVariantSale';

import {LocaleTexts} from '../client/utils/lang';
import {BasicClient} from '../client/utils/basicClient';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {BasicLocalService, BasicLocalServiceInfo} from './basicService';
import {AuthService} from './auth';

export class SaleService extends BasicLocalService<Sale, LocalSale> {

    saleClient:SaleClient;

    activeSale:LocalSale;

    constructor(@Inject(AuthService)  authService:AuthService) {
        this.saleClient = new SaleClient();
        super(<BasicLocalServiceInfo<Sale, LocalSale>>{
            client: this.saleClient,
            authService: authService,
            fromLocalConverter: LocalSaleFactory.fromLocalSale,
            toLocalConverter: LocalSaleFactory.toLocalSale
        });
    }

    closeSale(localSale:LocalSale):Promise<any> {
        var authToken = this.authService.authToken;
        return this.saleClient.closeSale(localSale.id, authToken);
    }
}