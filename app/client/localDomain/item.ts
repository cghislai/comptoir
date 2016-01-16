/**
 * Created by cghislai on 01/09/15.
 */

import {Item} from '../domain/item';

import {LocalCompany} from './company';
import {LocalPicture} from './picture';

import {LocaleTexts} from '../utils/lang';

import * as Immutable from 'immutable';

export interface LocalItem extends Immutable.Map<string, any> {
    id:number;
    company:LocalCompany;
    reference:string;
    name:LocaleTexts;
    description:LocaleTexts;

    vatExclusive:number;
    vatRate:number;

    mainPicture:LocalPicture;
}
var ItemRecord = Immutable.Record({
    id: null,
    company: null,
    reference: null,
    name: null,
    description: null,
    vatExclusive: null,
    vatRate: null,
    mainPicture: null
});

export class LocalItemFactory {

    static createNewItem(desc:any):LocalItem {
        return <any>ItemRecord(desc);
    }
}
