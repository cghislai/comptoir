/**
 * Created by cghislai on 06/08/15.
 */


import {Sale, SaleRef, SaleSearch, SaleFactory} from 'client/domain/sale';
import {Pagination} from 'client/utils/pagination';
import {ComptoirRequest} from 'client/utils/request';
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
            if (pagination.sorts != null) {
                url += "&sort=";
                var sorts = pagination.sorts;
                for (var col in sorts) {
                    var order = sorts[col];
                    url += col+"-"+order+',';
                }
            }
        }
        return url;
    }

    createSale(sale:Sale, authToken:string):Promise<SaleRef> {
        var request = new ComptoirRequest();
        var url = this.getSaleUrl();

        return request
            .post(sale, url, authToken)
            .then(function (response) {
                var saleRef = JSON.parse(response.text);
                return saleRef;
            })
    }

    getCreateSaleRequest(sale:Sale, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getSaleUrl();

        request.setup('POST', url, authToken);
        request.setupData(sale);
        return request;
    }


    updateSale(sale:Sale, authToken:string):Promise<SaleRef> {
        var request = new ComptoirRequest();
        var url = this.getSaleUrl(sale.id);

        return request
            .put(sale, url, authToken)
            .then(function (response) {
                var saleRef = JSON.parse(response.text);
                return saleRef;
            });
    }

    getUpdateSaleRequest(sale:Sale, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getSaleUrl(sale.id);

        request.setup('PUT', url, authToken);
        request.setupData(sale);
        return request;
    }

    getSale(id:number, authToken:string):Promise<Sale> {
        var request = new ComptoirRequest();
        var url = this.getSaleUrl(id);

        return request
            .get(url, authToken)
            .then(function (response) {
                var sale = JSON.parse(response.text, SaleFactory.fromJSONSaleReviver);
                return sale;
            });
    }

    getGetSaleRequest(id:number, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getSaleUrl(id);

        request.setup('GET', url, authToken);
        return request;
    }

    searchSales(search:SaleSearch, pagination:Pagination, authToken:string):Promise<SearchResult<Sale>> {
        var request = new ComptoirRequest();
        var url = this.getSearchUrl(pagination);

        return request
            .post(search, url, authToken)
            .then(function (response) {
                var result = new SearchResult<Sale>().parseResponse(response, SaleFactory.fromJSONSaleReviver);
                return result;
            });
    }
    deleteSale(id: number, authToken: string) : Promise<any> {
        var request = new ComptoirRequest();
        var url = this.getSaleUrl(id);

        return request
            .delete(url, authToken)
            .then(function (response) {
                return null;
            });
    }


    closeSale(id: number, authToken: string) : Promise<SaleRef> {
        var request = new ComptoirRequest();
        var url = this.getSaleUrl(id);
        url += "/state/CLOSED";

        return request
            .put(null, url, authToken)
            .then(function (response) {
                var saleRef = JSON.parse(response.text);
                return saleRef;
            });
    }
}