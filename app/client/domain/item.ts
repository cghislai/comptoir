/**
 * Created by cghislai on 01/09/15.
 */


import {CompanyRef} from 'client/domain/company';
import {ItemPictureRef} from 'client/domain/itemPicture';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {Pagination} from 'client/utils/pagination';

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

    mainPictureRef:ItemPictureRef;
}

export class ItemSearch {
    companyRef: CompanyRef;
    multiSearch:string;
    nameContains:string;
    descriptionContains:string;
    reference:string;
    referenceContains:string;
}

export class ItemFactory {
    static fromJSONItemReviver = (key, value)=> {
        if (key == 'name' || key == "description") {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    };
}