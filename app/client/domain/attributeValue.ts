/**
 * Created by cghislai on 04/08/15.
 */

import {AttributeDefinitionRef} from './attributeDefinition';
import {CompanyRef} from './company';
import {LocaleTexts, LocaleTextsFactory} from '../utils/lang';

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

    static fromJSONReviver = (key, value)=> {
        if (key ==='value') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    };
}