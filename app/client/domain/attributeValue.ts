/**
 * Created by cghislai on 04/08/15.
 */

import {AttributeDefinitionRef} from 'client/domain/attributeDefinition';
import {CompanyRef} from 'client/domain/company';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';



export class AttributeValue {
    id: number;
    attributeDefinitionRef: AttributeDefinitionRef;
    value: LocaleTexts;
}

export class AttributeValueRef {
    id: number;
    link: string;
    constructor(id?:number) {
        this.id = id;
    }
}


export class AttributeValueFactory {

    static fromJSONAttributeValueReviver = (key, value)=>{
        if (key == 'value') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }

}