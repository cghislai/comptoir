/**
 * Created by cghislai on 14/08/15.
 */
import {Inject} from 'angular2/angular2';

import {Sale, SaleRef, SaleSearch} from 'client/domain/sale';
import {ItemVariantSaleClient, ItemVariantSale, ItemVariantSaleRef, ItemVariantSaleSearch, ItemVariantSaleFactory} from 'client/domain/itemVariantSale';
import {Pagination} from 'client/utils/pagination';
import {SearchResult} from 'client/utils/search';

import {AuthService} from 'services/auth';

export class ItemVariantSaleService {
    client:ItemVariantSaleClient;
    authService:AuthService;

    constructor(@Inject authService:AuthService) {
        this.client = new ItemVariantSaleClient();
        this.authService = authService;
    }


    createItemSale(itemSale:ItemVariantSale):Promise<ItemVariantSaleRef> {
        if (itemSale.saleRef == null) {
            throw 'itemSale must have a saleRef';
        }
        var authToken = this.authService.authToken;
        return this.client.create(itemSale, authToken);
    }

    updateItemSale(itemSale:ItemVariantSale):Promise<ItemVariantSaleRef> {
        var authToken = this.authService.authToken;
        return this.client.update(itemSale, authToken);
    }


    saveItemSale(itemSale:ItemVariantSale):Promise<ItemVariantSale> {
        var thisView = this;

        if (itemSale.id == undefined) {

            return this.createItemSale(itemSale)
                .then((ref:ItemVariantSaleRef)=> {
                    return thisView.getItemSale(ref.id);
                });
        } else {
            return this.updateItemSale(itemSale)
                .then(()=> {
                    return itemSale;
                });
        }
    }

    searchItemSales(itemSearch:ItemVariantSaleSearch, pagination:Pagination):Promise<SearchResult<ItemVariantSale>> {
        var authToken = this.authService.authToken;
        return this.client.search(itemSearch, pagination, authToken);
    }

    getItemSale(id:number):Promise<ItemVariantSale> {
        var authToken = this.authService.authToken;
        return this.client.get(id, authToken);
    }

    removeItemSale(id: number) : Promise<any> {
        var authToken = this.authService.authToken;
        return this.client.remove(id, authToken);
    }
}