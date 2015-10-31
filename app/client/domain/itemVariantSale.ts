/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from './company';
import {ItemVariantRef} from './itemVariant';
import {SaleRef} from './sale';
import {Price} from './price';
import {LocaleTexts, LocaleTextsFactory} from '../utils/lang';
import {BasicClient, BasicCacheHandler, BasicClientResourceInfo} from '../utils/basicClient';


export class ItemVariantSaleClient extends BasicClient<ItemVariantSale> {

    private static RESOURCE_PATH:string = "/itemVariantSale";

    constructor() {
        super(<BasicClientResourceInfo<ItemVariantSale>>{
            resourcePath: ItemVariantSaleClient.RESOURCE_PATH,
            jsonReviver: ItemVariantSaleFactory.fromJSONItemVariantSaleReviver,
            cacheHandler: ItemVariantSaleFactory.cacheHandler
        });
    }
}

export class ItemVariantSale {
    id: number;
    dateTime: Date;
    itemVariantRef: ItemVariantRef;
    quantity: number;
    saleRef: SaleRef;
    comment: LocaleTexts;
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
    static cacheHandler = new BasicCacheHandler<ItemVariantSale>();
    static fromJSONItemVariantSaleReviver = (key, value)=>{
        if (key ==='comment') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }

}