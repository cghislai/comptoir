/**
 * Created by cghislai on 07/08/15.
 */
import {LocaleText, LocaleTextFactory} from 'client/domain/lang';
import {CompanyRef, CompanyFactory} from 'client/domain/company';
import {ItemPictureRef, ItemPictureFactory} from 'client/domain/itemPicture';
import {Pagination} from 'client/utils/pagination';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';

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
    static buildItemRefFromJSON(jsonObject:any):ItemRef {
        var itemRef = new ItemRef();
        itemRef.id = jsonObject.id;
        itemRef.link = jsonObject.link;
        return itemRef;
    }

    static buildItemFromJSON(jsonObject:any):Item {
        var item = new Item();
        item.id = jsonObject.id;
        item.companyRef = CompanyFactory.getCompanyRefFromJSON(jsonObject.companyRef);
        item.mainPictureRef = ItemPictureFactory.buildItemPictureRefFromJSON(jsonObject.companyref);
        item.reference = jsonObject.reference;
        item.model = jsonObject.model;
        var names = LocaleTextFactory.getLocaleTextArrayFromJSON(jsonObject.name);
        item.name = LocaleTextsFactory.getLocaleTextsFromTextArray(names);
        var descriptions = LocaleTextFactory.getLocaleTextArrayFromJSON(jsonObject.description);
        item.description = LocaleTextsFactory.getLocaleTextsFromTextArray(descriptions);
        item.vatExclusive = jsonObject.vatExclusive;
        item.vatRate = jsonObject.vatRate;
        return item;
    }
}