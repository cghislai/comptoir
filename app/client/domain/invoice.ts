/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {SaleRef} from 'client/domain/sale';
import {BasicClient, BasicClientResourceInfo} from 'client/utils/basicClient';


export class InvoiceClient extends BasicClient<Invoice> {

    private static RESOURCE_PATH:string = "/invoice";
    constructor() {
        super({
            resourcePath: InvoiceClient.RESOURCE_PATH,
            jsonReviver: InvoiceFactory.fromJSONInvoiceReviver,
            cache: InvoiceFactory.cache
        });
    }
}
export class Invoice {
    id: number;
    companyRef: CompanyRef;
    number: string;
    note: string;
    saleRef: SaleRef;
}

export class InvoiceRef {
    id: number;
    link: string;
    constructor(id?: number) {
        this.id = id;
    }
}

export class InvoiceSearch {
    companyRef: CompanyRef;
}

export class InvoiceFactory {
    static fromJSONInvoiceReviver = (key, value)=>{
        return value;
    }

    static cache: {[id: number] : Invoice} = {};
    static putInCache(invoice: Invoice) {
        var invoiceId = invoice.id;
        if (invoiceId == null) {
            throw 'no id';
        }
        InvoiceFactory.cache[invoiceId] = invoice;
    }

    static getFromCache(id: number) {
        return InvoiceFactory.cache[id];
    }

    static clearFromCache(id: number) {
        delete InvoiceFactory.cache[id];
    }

    static clearCache() {
        InvoiceFactory.cache = {};
    }
}