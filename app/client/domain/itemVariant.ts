/**
 * Created by cghislai on 07/08/15.
 */

import {ItemRef} from 'client/domain/item';
import {CompanyRef} from 'client/domain/company';
import {ItemPictureRef} from 'client/domain/itemPicture';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {Pagination} from 'client/utils/pagination';

export enum Pricing{
    ABSOLUTE,
    ADD_TO_BASE,
    PARENT_VALUE
}

export class AttributeDefinition {
    id:number;
    companyRef = CompanyRef;
    name:LocaleTexts;
}

export class AttributeDefinitionRef {
    id:number;
    link:string;

    constructor(id?:number) {
        if (id != null) {
            this.id = id;
        }
    }
}

export class AttributeValue {
    id: number;
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
    itemRef: ItemRef;
    variantReference:string;

    pricing:Pricing;
    pricingAmount: number;

    attributeValues:AttributeValue[];

    mainPictureRef:ItemPictureRef;
}

export class ItemVariantSearch {
    companyRef:CompanyRef;
    itemRef: ItemRef;
    multiSearch:string;
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
