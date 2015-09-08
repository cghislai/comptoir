/**
 * Created by cghislai on 04/08/15.
 */

import {AttributeDefinitionRef} from 'client/domain/attributeDefinition';
import {CompanyRef} from 'client/domain/company';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {BasicClient, BasicClientResourceInfo} from 'client/utils/basicClient';


export class AttributeValueClient extends BasicClient<AttributeValue> {

    private static RESOURCE_PATH:string = "/attribute/value";

    constructor() {
        super({
            resourcePath: AttributeValueClient.RESOURCE_PATH,
            jsonReviver: AttributeValueFactory.fromJSONAttributeValueReviver,
            cache: AttributeValueFactory.cache
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

    static cache: {[id: number] : AttributeValue} = {};
    static putInCache(attributeValue: AttributeValue) {
        var attributeValueId = attributeValue.id;
        if (attributeValueId == null) {
            throw 'no id';
        }
        AttributeValueFactory.cache[attributeValueId] = attributeValue;
    }

    static getFromCache(id: number) {
        return AttributeValueFactory.cache[id];
    }

    static clearFromCache(id: number) {
        delete AttributeValueFactory.cache[id];
    }

    static clearCache() {
        AttributeValueFactory.cache = {};
    }
}