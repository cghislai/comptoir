/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from './company';
import {ItemVariantRef} from './itemVariant';
import {SaleRef} from './sale';
import {Price} from './price';
import {LocaleTexts, LocaleTextsFactory} from '../utils/lang';


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
    static fromJSONReviver = (key, value)=>{
        if (key ==='comment') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }

}