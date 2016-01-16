/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from './company';
import {SaleRef} from './sale';

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
    static fromJSONReviver = (key, value)=>{
        return value;
    }

}