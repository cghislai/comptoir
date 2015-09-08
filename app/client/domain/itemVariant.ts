/**
 * Created by cghislai on 07/08/15.
 */

import {AttributeDefinitionRef} from 'client/domain/attributeDefinition';
import {AttributeValue, AttributeValueRef} from 'client/domain/attributeValue';
import {ItemRef,ItemSearch } from 'client/domain/item';
import {CompanyRef} from 'client/domain/company';
import {PictureRef} from 'client/domain/picture';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {BasicClient, BasicCacheHandler, BasicClientResourceInfo} from 'client/utils/basicClient';


export class ItemVariantClient extends BasicClient<ItemVariant> {

    private static RESOURCE_PATH:string = "/itemVariant";
    constructor() {
        super({
            resourcePath: ItemVariantClient.RESOURCE_PATH,
            jsonReviver: ItemVariantFactory.fromJSONItemVariantReviver,
            cacheHandler: ItemVariantFactory.cacheHandler
        });
    }
}

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
    static cacheHandler = new BasicCacheHandler<ItemVariant>();

    static fromJSONItemVariantReviver = (key, value)=> {
        if (key == 'name' || key == "description") {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    };

    static fromJSONPricingReviver = (value) => {
        return Pricing[Pricing[value]];
    }

}
