/**
 * Created by cghislai on 07/08/15.
 */

import {AttributeDefinitionRef} from './attributeDefinition';
import {AttributeValue, AttributeValueRef} from './attributeValue';
import {ItemRef,ItemSearch } from './item';
import {CompanyRef} from './company';
import {PictureRef} from './picture';
import {LocaleTexts, LocaleTextsFactory} from '../utils/lang';


export enum Pricing{
    ABSOLUTE,
    ADD_TO_BASE,
    PARENT_ITEM
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

    attributeValueRefs:AttributeValueRef[];

    mainPictureRef:PictureRef;
}

export class ItemVariantSearch {
    itemSearch:ItemSearch;
    itemRef:ItemRef;
    variantReference:string;
    variantReferenceContains:string;
}

export class ItemVariantFactory {

    static fromJSONReviver = (key, value)=> {
        if (key === 'name' || key === "description") {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    };
    //FIXME
    static fromJSONPricingReviver = (value) => {
        return Pricing[Pricing[value]];
    }

}
