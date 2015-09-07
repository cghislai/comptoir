/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {CustomerRef} from 'client/domain/customer';
import {InvoiceRef} from 'client/domain/invoice';
import {AccountingTransactionRef} from 'client/domain/accountingTransaction'

import {BasicClient, BasicClientResourceInfo} from 'client/utils/basicClient';
import {ComptoirRequest} from 'client/utils/request';

export class SaleClient extends BasicClient<Sale> {

    private static RESOURCE_PATH:string = "/sale";
    constructor() {
        super({
            resourcePath: SaleClient.RESOURCE_PATH,
            jsonReviver: SaleFactory.fromJSONSaleReviver
        });
    }


    closeSale(id:number, authToken:string):Promise<SaleRef> {
        var request = new ComptoirRequest();
        var url = this.getResourceUrl(id);
        url += "/state/CLOSED";

        return request
            .put(null, url, authToken)
            .then(function (response) {
                var saleRef = JSON.parse(response.text);
                return saleRef;
            });
    }

    getTotalPayed(id:number, authToken:string):Promise<number> {
        var request = new ComptoirRequest();
        var url = this.getResourceUrl(id);
        url += "/payed";

        return request
            .get(url, authToken)
            .then(function (response) {
                var value = JSON.parse(response.text);
                var payed = value.value;
                return payed;
            });
    }

    getGetTotalPayedRequest(id:number, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getResourceUrl(id);
        url += "/payed";

        request.setup('GET', url, authToken);
        return request;
    }
}

export class Sale {
    id: number;
    companyRef: CompanyRef;
    customerRef: CustomerRef;
    dateTime: Date;
    invoiceRef: InvoiceRef;
    vatExclusiveAmount: number;
    vatAmount: number;
    closed: boolean;
    reference: string;
    accountingTransactionRef: AccountingTransactionRef;
    discountRatio: number;
    discountAmount: number;
}

export class SaleRef {
    id: number;
    link: string;

    constructor(id?:number) {
        this.id = id;
    }
}

export class SaleSearch {
    companyRef: CompanyRef;
    closed: boolean;
}

export class SaleFactory {
    static fromJSONSaleReviver = (key, value)=> {
        if (key == 'dateTime') {
            var date = new Date(value);
            return date;
        }
       return value;
    }

}