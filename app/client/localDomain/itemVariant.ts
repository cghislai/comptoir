/**
 * Created by cghislai on 01/09/15.
 */

import {AttributeDefinition, AttributeDefinitionRef} from 'client/domain/attributeDefinition';
import {AttributeValue, AttributeValueRef} from 'client/domain/attributeValue';
import {ItemVariant, Pricing} from 'client/domain/itemVariant';
import {Item, ItemRef} from 'client/domain/item';
import {Picture, PictureRef} from 'client/domain/picture';

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
            case Pricing.PARENT_ITEM:
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
    static PRICING_PARENT_ITEM_LABEL = {
        'fr': 'Idem produit'
    };

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

    static toLocalItemVariant(itemVariant:ItemVariant) {
        var localVariant = new LocalItemVariant();
        LocalItemVariantFactory.updateLocalItemVariant(localVariant, itemVariant);
        return localVariant;
    }

    static fromLocalItemVariant(localVariant:LocalItemVariant) {
        var itemVariant:ItemVariant = new ItemVariant();
        itemVariant.attributeValueRefs = [];
        for (var localAttribute of localVariant.attributeValues) {
            var attributeValueRef:AttributeValueRef = new AttributeValueRef(localAttribute.id);
            itemVariant.attributeValueRefs.push(attributeValueRef);
        }
        itemVariant.id = localVariant.id;
        if (localVariant.item != null) {
            itemVariant.itemRef = new ItemRef(localVariant.item.id);
        }
        if (localVariant.mainPicture != null) {
            itemVariant.mainPictureRef = new PictureRef(localVariant.mainPicture.id);
        }
        itemVariant.pricing = Pricing[localVariant.pricing];
        itemVariant.pricingAmount = localVariant.pricingAmount;
        itemVariant.variantReference = localVariant.variantReference;
        return itemVariant;
    }

    static updateLocalItemVariant(localItemVariant:LocalItemVariant, itemVariant:ItemVariant) {
        localItemVariant.id = itemVariant.id;
        localItemVariant.variantReference = itemVariant.variantReference;
        localItemVariant.pricing = Pricing[itemVariant.pricing];
        localItemVariant.pricingAmount = itemVariant.pricingAmount;
        return localItemVariant;
    }

    static toLocalAttributeValue(attributevalue:AttributeValue):LocalAttributeValue {
        var localValue = new LocalAttributeValue();
        localValue.id = attributevalue.id;
        localValue.value = attributevalue.value;
        return localValue;
    }


    static fromLocalAttributeValue(localValue:LocalAttributeValue):AttributeValue {
    var attrValue = new AttributeValue();
        attrValue.id = localValue.id;
        attrValue.value = localValue.value;
        if (localValue.attributeDefinition != null) {
            attrValue.attributeDefinitionRef = new AttributeDefinitionRef(localValue.attributeDefinition.id);
        }
        return attrValue;
    }

}
