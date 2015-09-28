/**
 * Created by cghislai on 04/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {BasicClient, BasicCacheHandler, BasicClientResourceInfo} from 'client/utils/basicClient';


export class AttributeDefinitionClient extends BasicClient<AttributeDefinition> {

    private static RESOURCE_PATH:string = "/attribute/definition";
    constructor() {
        super(<BasicClientResourceInfo<AttributeDefinition>>{
            resourcePath: AttributeDefinitionClient.RESOURCE_PATH,
            jsonReviver: AttributeDefinitionFactory.fromJSONAttributeDefinitionReviver,
            cacheHandler: AttributeDefinitionFactory.cacheHandler
        });
    }
}

export class AttributeDefinition {
    id: number;
    name: LocaleTexts;
    companyRef: CompanyRef;
}

export class AttributeDefinitionRef {
    id: number;
    link: string;
    constructor(id?:number) {
        this.id = id;
    }
}

export class AttributeDefinitionSearch {
    companyRef: CompanyRef;
    nameContains: string;
    valueContains: string;
    multiSearch: string;
}


export class AttributeDefinitionFactory {

    static fromJSONAttributeDefinitionReviver = (key, value)=>{
        if (key == 'name') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }
    static cacheHandler = new BasicCacheHandler<AttributeDefinition>();
}