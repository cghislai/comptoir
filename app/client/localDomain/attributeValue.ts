/**
 * Created by cghislai on 08/09/15.
 */

import {LocalAttributeDefinition} from './attributeDefinition';
import {LocaleTexts} from '../utils/lang';
import * as Immutable from 'immutable';

export interface LocalAttributeValue extends Immutable.Map<string, any> {
    id:number;
    value:LocaleTexts;

    attributeDefinition:LocalAttributeDefinition;
}
var AttributeValueRecord = Immutable.Record({
    id: null,
    value: null,
    attributeDefinition: null
});

export class LocalAttributeValueFactory {

    static createAttributeValue(desc:any):LocalAttributeValue {
        return <any>AttributeValueRecord(desc);
    }
}