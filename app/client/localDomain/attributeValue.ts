/**
 * Created by cghislai on 08/09/15.
 */

import {AttributeValue, AttributeValueRef} from '../domain/attributeValue';
import {AttributeDefinition, AttributeDefinitionRef,AttributeDefinitionClient, AttributeDefinitionFactory} from '../domain/attributeDefinition';
import {LocaleTexts} from '../utils/lang';
import * as Immutable from 'immutable';

export interface LocalAttributeValue extends Immutable.Map<string, any>{
    id:number;
    value:LocaleTexts;

    attributeDefinition:AttributeDefinition;
}
var AttributeValueRecord = Immutable.Record({
    id: null,
    value: null,
    attributeDefinition: null
});
export function NewAttributeValue(desc: any) : LocalAttributeValue {
    return <any>AttributeValueRecord(desc);
}

export class LocalAttributeValueFactory {
    static  definitionClient = new AttributeDefinitionClient();

    static toLocalAttributeValue(attributevalue:AttributeValue, authToken):Promise<LocalAttributeValue> {
        var localValueDesc: any = {};
        localValueDesc.id = attributevalue.id;
        localValueDesc.value = attributevalue.value;

        var taskList = [];
        var definitionRef = attributevalue.attributeDefinitionRef;
        taskList.push(
            LocalAttributeValueFactory.definitionClient.getFromCacheOrServer(definitionRef.id, authToken)
                .then((definition)=> {
                    localValueDesc.attributeDefinition = definition;
                })
        );

        return Promise.all(taskList)
            .then(()=> {
                return NewAttributeValue(localValueDesc);
            });
    }


    static fromLocalAttributeValue(localValue:LocalAttributeValue):AttributeValue {
        var attrValue = new AttributeValue();
        attrValue.id = localValue.id;
        attrValue.value = localValue.value;
        if (localValue.attributeDefinition !== null) {
            attrValue.attributeDefinitionRef = new AttributeDefinitionRef(localValue.attributeDefinition.id);
        }
        return attrValue;
    }
}