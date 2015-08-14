/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/angular2';

import {Sale, SaleRef, SaleSearch} from 'client/domain/sale';
import {LocaleTexts} from 'client/utils/lang';
import {SearchResult} from 'client/utils/search';
import {SaleClient} from 'client/sale';
import {Pagination} from 'client/utils/pagination';

import {AuthService} from 'services/auth';

export class SaleService {

    client:SaleClient;
    authService:AuthService;

    constructor(@Inject authService:AuthService) {
        this.client = new SaleClient();
        this.authService = authService;
    }


    createSale(sale:Sale):Promise<SaleRef> {
        var authToken = this.authService.authToken;
        sale.companyRef = this.authService.loggedEmployee.companyRef;
        return this.client.createSale(sale, authToken);
    }

    updateSale(sale:Sale):Promise<SaleRef> {
        var authToken = this.authService.authToken;
        return this.client.updateSale(sale, authToken);
    }


    saveSale(sale: Sale) : Promise<SaleRef> {
        var savePromise : Promise<SaleRef>;
        if (sale.id == undefined) {
            savePromise = this.createSale(sale);
        } else {
            savePromise = this.updateSale(sale);
        }
        return savePromise.then((saleRef)=>{
            sale.id = saleRef.id;
            return saleRef;
        });
    }

    getSale(id:number):Promise<Sale> {
        var authToken = this.authService.authToken;
        return this.client.getSale(id, authToken);
    }

    searchSales(saleSearch:SaleSearch, pagination:Pagination):Promise<SearchResult<Sale>> {
        var authToken = this.authService.authToken;
        saleSearch.companyRef = this.authService.loggedEmployee.companyRef;
        return this.client.searchSales(saleSearch, pagination, authToken);
    }


    removeSale(sale:Sale):Promise<boolean> {
        var authToken = this.authService.authToken;
        // TODO
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

}