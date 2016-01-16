/**
 * Created by cghislai on 08/09/15.
 */

import {Invoice} from '../domain/invoice';

import {LocalCompany} from './company';
import {LocalSale} from './sale';

import * as Immutable from 'immutable';

export interface LocalInvoice extends Immutable.Map<string, any> {
    id: number;
    company: LocalCompany;
    number: string;
    note: string;
    sale: LocalSale;
}
var InvoiceRecord = Immutable.Record({
    id: null,
    company: null,
    number: null,
    note: null,
    sale: null
});
export class LocalInvoiceFactory {

    static createNewInvoice(desc:any):LocalInvoice {
        return <any>InvoiceRecord(desc);
    }
}