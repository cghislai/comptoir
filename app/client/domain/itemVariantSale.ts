/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {ItemVariantRef} from 'client/domain/itemVariant';
import {SaleRef} from 'client/domain/sale';
import {Price} from 'client/domain/price';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {BasicClient, BasicClientResourceInfo} from 'client/utils/basicClient';


export class ItemVariantSaleClient extends BasicClient<ItemVariantSale> {

    private static RESOURCE_PATH:string = "/itemVariantSale";

    constructor() {
        super({
            resourcePath: ItemVariantSaleClient.RESOURCE_PATH,
            jsonReviver: ItemVariantSaleFactory.fromJSONItemVariantSaleReviver,
            cache: ItemVariantSaleFactory.cache
        });
    }
}

export class ItemVariantSale {
    id: number;
    dateTime: Date;
    itemVariantRef: ItemVariantRef;
    quantity: number;
    saleRef: SaleRef;
    comment: LocaleTexts = new LocaleTexts();
    vatExclusive: number;
    vatRate: number;
    discountRatio: number;
    total: number;
}

export class ItemVariantSaleRef {
    id: number;
    link: string;
}

export class ItemVariantSaleSearch {
    companyRef: CompanyRef;
    saleRef: SaleRef;
    itemVariantRef: ItemVariantRef;
}

export class ItemVariantSaleFactory {
    static fromJSONItemVariantSaleReviver = (key, value)=>{
        if (key == 'comment') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }

    static cache: {[id: number] : ItemVariantSale} = {};
    static putInCache(itemVariantSale: ItemVariantSale) {
        var itemVariantSaleId = itemVariantSale.id;
        if (itemVariantSaleId == null) {
            throw 'no id';
        }
        ItemVariantSaleFactory.cache[itemVariantSaleId] = itemVariantSale;
    }

    static getFromCache(id: number) {
        return ItemVariantSaleFactory.cache[id];
    }

    static clearFromCache(id: number) {
        delete ItemVariantSaleFactory.cache[id];
    }

    static clearCache() {
        ItemVariantSaleFactory.cache = {};
    }
}