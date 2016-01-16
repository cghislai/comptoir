/**
 * Created by cghislai on 01/09/15.
 */


import {LocalCompany} from './company';
import {LocalCustomer} from './customer';
import {LocaleTexts} from '../utils/lang';


import * as Immutable from 'immutable';

export interface LocalPos extends Immutable.Map<string, any> {
    id:number;
    company:LocalCompany;
    name:string;
    description:LocaleTexts;
    defaultCustomer:LocalCustomer;
}
var PosRecord = Immutable.Record({
    id: null,
    company: null,
    name: null,
    description: null,
    defaultCustomer: null
});

export class LocalPosFactory {

    static createNewPos(desc:any):LocalPos {
        return <any>PosRecord(desc);
    }
}