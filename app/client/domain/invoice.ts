/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from './company';
import {SaleRef} from './sale';
import {BasicClient,BasicCacheHandler, BasicClientResourceInfo} from '../utils/basicClient';


export class InvoiceClient extends BasicClient<Invoice> {

    private static RESOURCE_PATH:string = "/invoice";
    constructor() {
        super(<BasicClientResourceInfo<Invoice>>{
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