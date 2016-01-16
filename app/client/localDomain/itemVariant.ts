/**
 * Created by cghislai on 01/09/15.
 */

import {Pricing} from '../domain/itemVariant';
import {LocalAttributeValue} from './attributeValue';
import {LocalItem} from './item';
import {LocalPicture} from './picture';
import {LocaleTexts, LocaleTextsFactory} from '../utils/lang';

import * as Immutable from 'immutable';

export interface LocalItemVariant extends Immutable.Map<string, any> {
    id:number;
    variantReference:string;
    pricing:Pricing;
    pricingAmount:number;

    attributeValues:LocalAttributeValue[];
    mainPicture:LocalPicture;
    item:LocalItem;

}
var ItemVariantRecord = Immutable.Record({
    id: null,
    variantReference: null,
    pricing: null,
    pricingAmount: null,
    attributeValues: null,
    mainPicture: null,
    item: null
});

export class LocalItemVariantFactory {
    static createNewItemVariant(desc:any):LocalItemVariant {
        return <any>ItemVariantRecord(desc);
    }

    static PRICING_ADD_TO_BASE_LABEL = LocaleTextsFactory.toLocaleTexts({
        'fr': 'À ajouter'
    });
    static PRICING_ABSOLUTE_LABEL = LocaleTextsFactory.toLocaleTexts({
        'fr': 'Prix de la variante'
    });
    static PRICING_PARENT_ITEM_LABEL = LocaleTextsFactory.toLocaleTexts({
        'fr': 'Idem produit'
    });

    static getPricingLabel(pricing:Pricing):LocaleTexts {
        switch (pricing) {
            case Pricing.ABSOLUTE:
                return LocalItemVariantFactory.PRICING_ABSOLUTE_LABEL;
            case Pricing.ADD_TO_BASE:
                return LocalItemVariantFactory.PRICING_ADD_TO_BASE_LABEL;
            case Pricing.PARENT_ITEM:
                return LocalItemVariantFactory.PRICING_PARENT_ITEM_LABEL;
        }
        return null;
    }

    static calcPrice(localVariant:LocalItemVariant, includeTaxes:boolean):number {
        var vatExclusive:number = 0;
        switch (localVariant.pricing) {
            case Pricing.ABSOLUTE:
            {
                vatExclusive = localVariant.pricingAmount;
                break;
            }
            case Pricing.ADD_TO_BASE:
            {
                if (localVariant.item == null) {
                    return null;
                }
                var itemVatExclusive = localVariant.item.vatExclusive;
                vatExclusive = itemVatExclusive + localVariant.pricingAmount;
                break;
            }
            case Pricing.PARENT_ITEM:
            {
                if (localVariant.item == null) {
                    return null;
                }
                vatExclusive = localVariant.item.vatExclusive;
                break;
            }
        }
        if (!includeTaxes) {
            return vatExclusive;
        }
        var vatInclusive = vatExclusive * (1 + localVariant.item.vatRate);
        return vatInclusive;
    }

}
