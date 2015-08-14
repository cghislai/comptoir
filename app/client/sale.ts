/**
 * Created by cghislai on 06/08/15.
 */


import {Sale, SaleRef, SaleSearch, SaleFactory} from 'client/domain/sale';
import {Pagination} from 'client/utils/pagination';
import {ComptoirrRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/search';
import {ServiceConfig} from 'client/utils/service';


export class SaleClient {

    private static RESOURCE_PATH:string = "/sale";

    private getSaleUrl(id?:number) {
        var url = ServiceConfig.URL + SaleClient.RESOURCE_PATH;
        if (id != undefined) {
            url += "/" + id;
        }
        return url;
    }

    private getSearchUrl(pagination:Pagination) {
        var url = ServiceConfig.URL + SaleClient.RESOURCE_PATH;
        url += '/search';
        if (pagination != null) {
            url += '?offset=';
            url += pagination.firstIndex;
            url += "&length=";
            url += pagination.pageSize;
            return url;
        }
        return url;
    }

    createSale(sale:Sale, authToken:string):Promise<SaleRef> {
        var request = new ComptoirrRequest();
        var url = this.getSaleUrl();

        return request
            .post(sale, url, authToken)
            .then(function (response) {
                var saleRef = JSON.parse(response.text);
                return saleRef;
            })
    }

    updateSale(sale:Sale, authToken:string):Promise<SaleRef> {
        var request = new ComptoirrRequest();
        var url = this.getSaleUrl(sale.id);

        return request
            .put(sale, url, authToken)
            .then(function (response) {
                var saleRef = JSON.parse(response.text);
                return saleRef;
            });
    }

    getSale(id:number, authToken:string):Promise<Sale> {
        var request = new ComptoirrRequest();
        var url = this.getSaleUrl(id);

        return request
            .get(url, authToken)
            .then(function (response) {
                var sale = JSON.parse(response.text, SaleFactory.fromJSONSaleReviver);
                return sale;
            });
    }

    searchSales(search:SaleSearch, pagination:Pagination, authToken:string):Promise<SearchResult<Sale>> {
        var request = new ComptoirrRequest();
        var url = this.getSearchUrl(pagination);

        return request
            .post(search, url, authToken)
            .then(function (response) {
                var result = new SearchResult<Sale>().parseResponse(response, SaleFactory.fromJSONSaleReviver);
                return result;
            });
    }
}