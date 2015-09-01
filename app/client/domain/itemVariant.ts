/**
 * Created by cghislai on 07/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {ItemPictureRef} from 'client/domain/itemPicture';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {Pagination} from 'client/utils/pagination';

export class ItemVariantRef {
    id:number;
    link:string;

    constructor(id?: number) {
        this.id = id;
    }
}

export class ItemVariant {
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

export class ItemVariantSearch {
    companyRef: CompanyRef;
    multiSearch:string;
    nameContains:string;
    descriptionContains:string;
    reference:string;
    referenceContains:string;
    model:string;
}

export class ItemVariantFactory {
    static fromJSONItemReviver = (key, value)=>{
        if (key == 'name' || key == "description") {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    };

}