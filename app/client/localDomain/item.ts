/**
 * Created by cghislai on 01/09/15.
 */

import {Item} from 'client/domain/item';
import {ItemPicture, ItemPictureRef} from 'client/domain/itemPicture';
import {CompanyRef} from 'client/domain/company';
import {LocalPicture} from 'client/localDomain/picture';
import {LocaleTexts} from 'client/utils/lang';
import {ComptoirRequest} from 'client/utils/request';

export class LocalItem {
    id:number;
    companyRef:CompanyRef;
    reference:string;
    name:LocaleTexts;
    description:LocaleTexts;

    vatExclusive:number;
    vatRate:number;

    mainPicture:LocalPicture;
    mainPictureRequest:ComptoirRequest;
}

export class LocalItemFactory {
    static toLocalItem(item:Item) {
        var localItem = new LocalItem();
        LocalItemFactory.updateLocalItem(localItem, item);
        return localItem;
    }

    static fromLocalItem(localItem:LocalItem) {
        var item = new Item();
        item.companyRef = localItem.companyRef;
        item.description = localItem.description;
        item.id = localItem.id;
        if (localItem.mainPicture != null) {
            var picId = localItem.mainPicture.id;
            var picRef = new ItemPictureRef(picId)
            item.mainPictureRef = picRef;
        }
        item.name = localItem.name;
        item.reference = localItem.reference;
        item.vatExclusive = localItem.vatExclusive;
        item.vatRate = localItem.vatRate;
        return item;
    }

    static updateLocalItem(localItem:LocalItem, item:Item) {
        localItem.companyRef = item.companyRef;
        localItem.description = item.description;
        localItem.id = item.id;
        localItem.name = item.name;
        localItem.reference = item.reference;
        localItem.vatExclusive = item.vatExclusive;
        localItem.vatRate = item.vatRate;
    }
}
