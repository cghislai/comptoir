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
import {LocaleTexts} from 'client/utils/lang';
import {ComptoirRequest} from 'client/utils/request';


export class LocalItemVariant {
    id:number;
    variantReference:string;
    pricing:Pricing;
    pricingAmount:number;

    attributeValues:LocalAttributeValue[];
    mainPicture:LocalPicture;
    item:LocalItem;

    calcPrice():number {
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

    static toLocalItemVariant(itemVariant:ItemVariant, authToken):Promise<LocalItemVariant> {
        var localVariant = new LocalItemVariant();
        return LocalItemVariantFactory.updateLocalItemVariant(localVariant, itemVariant, authToken);
    }


    static updateLocalItemVariant(localItemVariant:LocalItemVariant, itemVariant:ItemVariant, authToken:string):Promise<LocalItemVariant> {
        localItemVariant.id = itemVariant.id;
        localItemVariant.variantReference = itemVariant.variantReference;
        localItemVariant.pricing = Pricing[itemVariant.pricing];
        localItemVariant.pricingAmount = itemVariant.pricingAmount;

        localItemVariant.attributeValues = [];
        var taskList = [];
        var attributeValueRefList = itemVariant.attributeValueRefs;
        var attributeValueClient = new AttributeValueClient();
        for (var attributeValueRef of attributeValueRefList) {
            var atributeId = attributeValueRef.id;
            taskList.push(
                attributeValueClient.getFromCacheOrServer(atributeId, authToken)
                    .then((attrValue)=> {
                        return LocalAttributeValueFactory.toLocalAttributeValue(attrValue, authToken);
                    }).then((localValue: LocalAttributeValue)=> {
                        localItemVariant.attributeValues.push(localValue);
                    })
            );
        }

        var itemRef = itemVariant.itemRef;
        var itemClient = new ItemClient();
        taskList.push(
            itemClient.getFromCacheOrServer(itemRef.id, authToken)
                .then((item)=> {
                    return LocalItemFactory.toLocalItem(item, authToken);
                }).then((localItem: LocalItem)=> {
                    localItemVariant.item = localItem;
                })
        );

        var mainPictureRef = itemVariant.mainPictureRef;
        if (mainPictureRef != null) {
            var picId = mainPictureRef.id;
            var pictureClient = new PictureClient();
            taskList.push(
                pictureClient.getFromCacheOrServer(picId, authToken)
                    .then((picture)=> {
                        return LocalPictureFactory.toLocalPicture(picture, authToken);
                    }).then((localPicture: LocalPicture)=> {
                        localItemVariant.mainPicture = localPicture;
                    })
            );
        }


        return Promise.all(taskList)
            .then(()=> {
                return localItemVariant;
            })
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


}
