/**
 * Created by cghislai on 04/08/15.
 */

import {CompanyRef} from './company';
import {LocaleTexts, LocaleTextsFactory} from '../utils/lang';

export class AttributeDefinition {
    id:number;
    name:LocaleTexts;
    companyRef:CompanyRef;
}

export class AttributeDefinitionRef {
    id:number;
    link:string;

    constructor(id?:number) {
        this.id = id;
    }
}

export class AttributeDefinitionSearch {
    companyRef:CompanyRef;
    nameContains:string;
    valueContains:string;
    multiSearch:string;
    locale:string;
}


export class AttributeDefinitionFactory {

    static fromJSONReviver = (key, value)=> {
        if (key === 'name') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    };
}