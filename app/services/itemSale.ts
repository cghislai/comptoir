/**
 * Created by cghislai on 14/08/15.
 */
import {Inject} from 'angular2/angular2';

import {Sale, SaleRef, SaleSearch} from 'client/domain/sale';
import {ItemSale, ItemSaleRef, ItemSaleSearch, ItemSaleFactory} from 'client/domain/itemSale';
import {ItemSaleClient} from 'client/itemSale';
import {Pagination} from 'client/utils/pagination';
import {SearchResult} from 'client/utils/search';

import {AuthService} from 'services/auth';

export class ItemSaleService {
    client:ItemSaleClient;
    authService:AuthService;

    constructor(@Inject authService:AuthService) {
        this.client = new ItemSaleClient();
        this.authService = authService;
    }


    createItemSale(itemSale:ItemSale):Promise<ItemSaleRef> {
        if (itemSale.saleRef == null) {
            throw 'itemSale must have a saleRef';
        }
        var authToken = this.authService.authToken;
        return this.client.createItemSale(itemSale, authToken);
    }

    updateItemSale(itemSale:ItemSale):Promise<ItemSaleRef> {
        var authToken = this.authService.authToken;
        return this.client.updateItemSale(itemSale, authToken);
    }


    saveItemSale(itemSale:ItemSale):Promise<ItemSale> {
        var thisView = this;

        if (itemSale.id == undefined) {

            return this.createItemSale(itemSale)
                .then((ref:ItemSaleRef)=> {
                    return thisView.getItemSale(ref.id);
                });
        } else {
            return this.updateItemSale(itemSale)
                .then(()=> {
                    return itemSale;
                });
        }
    }

    searchItemSales(itemSearch:ItemSaleSearch, pagination:Pagination):Promise<SearchResult<ItemSale>> {
        var authToken = this.authService.authToken;
        return this.client.searchItemSales(itemSearch, pagination, authToken);
    }

    getItemSale(id:number):Promise<ItemSale> {
        var authToken = this.authService.authToken;
        return this.client.getItemSale(id, authToken);
    }

    removeItemSale(id: number) : Promise<any> {
        var authToken = this.authService.authToken;
        return this.client.removeItemSale(id, authToken);
    }
}