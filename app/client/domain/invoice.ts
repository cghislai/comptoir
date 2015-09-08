/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {SaleRef} from 'client/domain/sale';
import {BasicClient,BasicCacheHandler, BasicClientResourceInfo} from 'client/utils/basicClient';


export class InvoiceClient extends BasicClient<Invoice> {

    private static RESOURCE_PATH:string = "/invoice";
    constructor() {
        super({
            resourcePath: InvoiceClient.RESOURCE_PATH,
            jsonReviver: InvoiceFactory.fromJSONInvoiceReviver,
            cacheHandler: InvoiceFactory.cacheHandler
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
    static cacheHandler = new BasicCacheHandler<Invoice>();
    static fromJSONInvoiceReviver = (key, value)=>{
        return value;
    }

}