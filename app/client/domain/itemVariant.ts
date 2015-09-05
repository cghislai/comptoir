/**
 * Created by cghislai on 07/08/15.
 */

import {AttributeDefinitionRef} from 'client/domain/attributeDefinition';
import {ItemRef,ItemSearch } from 'client/domain/item';
import {CompanyRef} from 'client/domain/company';
import {ItemPictureRef} from 'client/domain/itemPicture';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {Pagination} from 'client/utils/pagination';

export enum Pricing{
    ABSOLUTE,
    ADD_TO_BASE,
    PARENT_ITEM
}

export class AttributeValue {
    id:number;
    attributeDefinitionRef:AttributeDefinitionRef;
    value:LocaleTexts;
}


export class ItemVariantRef {
    id:number;
    link:string;

    constructor(id?:number) {
        this.id = id;
    }
}

export class ItemVariant {
    id:number;
    itemRef:ItemRef;
    variantReference:string;

    pricing:string;
    pricingAmount:number;

    attributeValueRefs:AttributeValue[];

    mainPictureRef:ItemPictureRef;
}

export class ItemVariantSearch {
    itemSearch:ItemSearch;
    itemRef:ItemRef;
    variantReference:string;
    variantReferenceContains:string;
}

export class ItemVariantFactory {
    static fromJSONItemVariantReviver = (key, value)=> {
        if (key == 'name' || key == "description") {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    };

    static fromJSONAttributeValueReviver = (key, value)=> {
        if (key == 'value') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        if (key == 'pricing') {
            return ItemVariantFactory.fromJSONPricingReviver(value);
        }
        return value;
    }

    static fromJSONPricingReviver = (value) => {
        return Pricing[Pricing[value]];
    }
}
