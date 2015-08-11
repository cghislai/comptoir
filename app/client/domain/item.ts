/**
 * Created by cghislai on 07/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {ItemPictureRef} from 'client/domain/itemPicture';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {Pagination} from 'client/utils/pagination';

export class ItemRef {
    id:number;
    link:string;
}

export class Item {
    id:number;
    companyRef:CompanyRef;
    mainPictureRef:ItemPictureRef;
    reference:string;
    model:string;
    name:LocaleTexts;
    description:LocaleTexts;
    vatExclusive:number;
    vatRate:number;
}

export class ItemSearch {
    pagination:Pagination;
    companyId:number;
    multiSearch:string;
    nameContains:string;
    descriptionContains:string;
    reference:string;
    referenceContains:string;
    model:string;
}

export class ItemFactory {
    static fromJSONItemReviver = (key, value)=>{
        if (key == 'name' || key == "description") {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    };

}