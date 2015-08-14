/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {ItemRef} from 'client/domain/item';
import {SaleRef} from 'client/domain/sale';
import {Price} from 'client/domain/price';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';

export class ItemSale {
    id: number;
    dateTime: Date;
    itemRef: ItemRef;
    vatExclusive: number;
    vatRate: number;
    quantity: number;
    saleRef: SaleRef;
    comment: LocaleTexts;
}

export class ItemSaleRef {
    id: number;
    link: string;
}

export class ItemSaleSearch {
    companyRef: CompanyRef;
    saleRef: SaleRef;
    itemRef: ItemRef;
}

export class ItemSaleFactory {
    static fromJSONItemSaleReviver = (key, value)=>{
        if (key == 'comment') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }
}