/**
 * Created by cghislai on 01/09/15.
 */


import {CompanyRef} from './company';
import {PictureRef} from './picture';
import {LocaleTexts, LocaleTextsFactory} from '../utils/lang';

export class ItemRef {
    id: number;
    link: string;

    constructor(id?: number) {
        this.id = id;
    }
}

export class Item {
    id: number;
    companyRef:CompanyRef;
    reference: string;
    name:LocaleTexts;
    description:LocaleTexts;

    vatExclusive:number;
    vatRate:number;

    mainPictureRef:PictureRef;
}

export class ItemSearch {
    companyRef: CompanyRef;
    multiSearch:string;
    nameContains:string;
    descriptionContains:string;
    reference:string;
    referenceContains:string;
    locale: string;
}

export class ItemFactory {
    static fromJSONReviver = (key, value)=> {
        if (key ==='name' || key ==="description") {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }
}