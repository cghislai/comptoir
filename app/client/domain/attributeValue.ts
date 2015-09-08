/**
 * Created by cghislai on 04/08/15.
 */

import {AttributeDefinitionRef} from 'client/domain/attributeDefinition';
import {CompanyRef} from 'client/domain/company';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {BasicClient,BasicCacheHandler, BasicClientResourceInfo} from 'client/utils/basicClient';


export class AttributeValueClient extends BasicClient<AttributeValue> {

    private static RESOURCE_PATH:string = "/attribute/value";

    constructor() {
        super({
            resourcePath: AttributeValueClient.RESOURCE_PATH,
            jsonReviver: AttributeValueFactory.fromJSONAttributeValueReviver,
            cacheHandler: AttributeValueFactory.cacheHandler
        });
    }
}

export class AttributeValue {
    id:number;
    attributeDefinitionRef:AttributeDefinitionRef;
    value:LocaleTexts;
}

export class AttributeValueRef {
    id:number;
    link:string;

    constructor(id?:number) {
        this.id = id;
    }
}


export class AttributeValueFactory {

    static fromJSONAttributeValueReviver = (key, value)=> {
        if (key == 'value') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }

    static cacheHandler = new BasicCacheHandler<AttributeValue>();
}