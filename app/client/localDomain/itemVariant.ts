/**
 * Created by cghislai on 01/09/15.
 */

import {ItemVariant, Pricing,
    AttributeDefinition, AttributeDefinitionRef, AttributeValue} from 'client/domain/itemVariant';
import {Item, ItemRef} from 'client/domain/item';
import {ItemPicture, ItemPictureRef} from 'client/domain/itemPicture';

import {LocalItem} from 'client/localDomain/item';
import {LocalPicture} from 'client/localDomain/picture';
import {LocaleTexts} from 'client/utils/lang';
import {ComptoirRequest} from 'client/utils/request';

export class LocalAttributeValue {
    id:number;
    value:LocaleTexts;

    attributeDefinition:AttributeDefinition;
    attributeDefinitionRequest:ComptoirRequest;
}

export class LocalItemVariant {
    id:number;
    variantReference:string;
    pricing:Pricing;
    pricingAmount:number;

    attributeValues:LocalAttributeValue[];
    mainPicture:LocalPicture;
    mainPictureRequest:ComptoirRequest;
    item:LocalItem;
    itemRequest:ComptoirRequest;

    calcPrice(): number {
        switch (this.pricing) {
            case Pricing.ABSOLUTE:
            {
                return this.pricingAmount;
            }
            case Pricing.ADD_TO_BASE:
            {
                if (this.item == null) {
                    return null;
                }
                var itemVatExclusive = this.item.vatExclusive;
                return itemVatExclusive + this.pricingAmount;
            }
            case Pricing.PARENT_VALUE:
            {
                if (this.item == null) {
                    return null;
                }
                return this.item.vatExclusive;
            }
        }
        return null;
    }
}

export class LocalItemVariantFactory {
    static PRICING_ADD_TO_BASE_LABEL = {
        'fr': 'À ajouter'
    };
    static PRICING_ABSOLUTE_LABEL = {
        'fr': 'Prix de la variante'
    };
    static PRICING_PARENT_VALUE_LABEL = {
        'fr': 'Idem produit'
    };

    static getPricingLabel(pricing:Pricing):LocaleTexts {
        switch (pricing) {
            case Pricing.ABSOLUTE:
                return LocalItemVariantFactory.PRICING_ABSOLUTE_LABEL;
            case Pricing.ADD_TO_BASE:
                return LocalItemVariantFactory.PRICING_ADD_TO_BASE_LABEL;
            case Pricing.PARENT_VALUE:
                return LocalItemVariantFactory.PRICING_PARENT_VALUE_LABEL;
        }
        return null;
    }

    static toLocalItemVariant(itemVariant:ItemVariant) {
        var localVariant = new LocalItemVariant();
        LocalItemVariantFactory.updateLocalItemVariant(localVariant, itemVariant);
        return localVariant;
    }

    static fromLocalItemVariant(localVariant:LocalItemVariant) {
        var itemVariant:ItemVariant = new ItemVariant();
        itemVariant.attributeValues = [];
        for (var localAttribute of localVariant.attributeValues) {
            var attributeValue:AttributeValue = new AttributeValue();
            attributeValue.attributeDefinitionRef = new AttributeDefinitionRef(localAttribute.id);
            attributeValue.id = localAttribute.id;
            attributeValue.value = localAttribute.value;
            itemVariant.attributeValues.push(attributeValue);
        }
        itemVariant.id = localVariant.id;
        if (localVariant.item != null) {
            itemVariant.itemRef = new ItemRef(localVariant.item.id);
        }
        if (localVariant.mainPicture != null) {
            itemVariant.mainPictureRef = new ItemPictureRef(localVariant.mainPicture.id);
        }
        itemVariant.pricing = localVariant.pricing;
        itemVariant.pricingAmount = localVariant.pricingAmount;
        itemVariant.variantReference = localVariant.variantReference;
        return itemVariant;
    }

    static updateLocalItemVariant(localItemVariant:LocalItemVariant, itemVariant:ItemVariant) {
        localItemVariant.id = itemVariant.id;
        localItemVariant.variantReference = itemVariant.variantReference;
        localItemVariant.pricing = itemVariant.pricing;
        localItemVariant.pricingAmount = itemVariant.pricingAmount;
        return localItemVariant;
    }

    static toLocalAttributeValue(attributevalue:AttributeValue):LocalAttributeValue {
        var localValue = new LocalAttributeValue();
        localValue.id = attributevalue.id;
        localValue.value = attributevalue.value;
        return localValue;
    }

}
