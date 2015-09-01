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
    ADD_TO_BASE
}

export class AttributeDefinition {
    id:number;
    company = CompanyRef;
    name:string;
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
    mainPictureRef:ItemPictureRef;
    reference:string;

    pricing:Pricing;
    attributes:AttributeValue[];

}

export class ItemVariantSearch {
    companyRef:CompanyRef;
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
