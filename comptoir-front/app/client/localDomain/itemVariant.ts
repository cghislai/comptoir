/**
 * Created by cghislai on 01/09/15.
 */

import {AttributeValue, AttributeValueRef, AttributeValueClient, AttributeValueFactory} from 'client/domain/attributeValue';
import {ItemVariant, Pricing} from 'client/domain/itemVariant';
import {Item, ItemRef, ItemClient, ItemFactory} from 'client/domain/item';
import {Picture, PictureRef, PictureClient, PictureFactory} from 'client/domain/picture';

import {LocalItem, LocalItemFactory} from 'client/localDomain/item';
import {LocalAttributeValue, LocalAttributeValueFactory} from 'client/localDomain/attributeValue';
import {LocalPicture, LocalPictureFactory} from 'client/localDomain/picture';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';

import {Map, Record} from 'immutable';

export interface LocalItemVariant extends Map<string, any> {
    id:number;
    variantReference:string;
    pricing:Pricing;
    pricingAmount:number;

    attributeValues:LocalAttributeValue[];
    mainPicture:LocalPicture;
    item:LocalItem;

}
var ItemVariantRecord = Record({
    id: null,
    variantReference: null,
    pricing: null,
    pricingAmount: null,
    attributeValues: null,
    mainPicture: null,
    item: null
});
export function NewItemVariant(desc:any):LocalItemVariant {
    return <any>ItemVariantRecord(desc);
}

export class LocalItemVariantFactory {
    static attributeValueClient = new AttributeValueClient();
    static itemClient = new ItemClient();
    static pictureClient = new PictureClient();

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

    static toLocalItemVariant(itemVariant:ItemVariant, authToken):Promise<LocalItemVariant> {
        var localVariantDesc:any = {};
        localVariantDesc.id = itemVariant.id;
        localVariantDesc.variantReference = itemVariant.variantReference;
        localVariantDesc.pricing = Pricing[itemVariant.pricing];
        localVariantDesc.pricingAmount = itemVariant.pricingAmount;

        localVariantDesc.attributeValues = [];
        var taskList = [];
        var attributeValueRefList = itemVariant.attributeValueRefs;
        for (var attributeValueRef of attributeValueRefList) {
            var attributeid = attributeValueRef.id;
            taskList.push(
                LocalItemVariantFactory.attributeValueClient.getFromCacheOrServer(attributeid, authToken)
                    .then((attrValue)=> {
                        return LocalAttributeValueFactory.toLocalAttributeValue(attrValue, authToken);
                    }).then((localValue:LocalAttributeValue)=> {
                        localVariantDesc.attributeValues.push(localValue);
                    })
            );
        }

        var itemRef = itemVariant.itemRef;
        taskList.push(
            LocalItemVariantFactory.itemClient.getFromCacheOrServer(itemRef.id, authToken)
                .then((item)=> {
                    return LocalItemFactory.toLocalItem(item, authToken);
                }).then((localItem:LocalItem)=> {
                    localVariantDesc.item = localItem;
                })
        );

        var mainPictureRef = itemVariant.mainPictureRef;
        if (mainPictureRef != null) {
            var picId = mainPictureRef.id;
            taskList.push(
                LocalItemVariantFactory.pictureClient.getFromCacheOrServer(picId, authToken)
                    .then((picture)=> {
                        return LocalPictureFactory.toLocalPicture(picture, authToken);
                    }).then((localPicture:LocalPicture)=> {
                        localVariantDesc.mainPicture = localPicture;
                    })
            );
        }

        return Promise.all(taskList)
            .then(()=> {
                return NewItemVariant(localVariantDesc);
            });
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
