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
            jsonReviver: InvoiceFactory.fromJSONInvoiceReviver
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
}

export class InvoiceSearch {
    companyRef: CompanyRef;
}

export class InvoiceFactory {
    static fromJSONInvoiceReviver = (key, value)=>{
        return value;
    }

}