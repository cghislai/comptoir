/**
 * Created by cghislai on 08/09/15.
 */

import {AttributeValue, AttributeValueRef} from 'client/domain/attributeValue';
import {AttributeDefinition, AttributeDefinitionRef,AttributeDefinitionClient, AttributeDefinitionFactory} from 'client/domain/attributeDefinition';
import {LocaleTexts} from 'client/utils/lang';

export class LocalAttributeValue {
    id:number;
    value:LocaleTexts;

    attributeDefinition:AttributeDefinition;
}

export class LocalAttributeValueFactory {
    static toLocalAttributeValue(attributevalue:AttributeValue, authToken):Promise<LocalAttributeValue> {
        var localValue = new LocalAttributeValue();
        return LocalAttributeValueFactory.updateLocalAttributeValue(localValue, attributevalue, authToken);
    }

    static updateLocalAttributeValue(localValue:LocalAttributeValue, value:AttributeValue, authToken:string):Promise<LocalAttributeValue> {
        localValue.id = value.id;
        localValue.value = value.value;

        var taskList = [];
        var definitionRef = value.attributeDefinitionRef;
        var definitionClient = new AttributeDefinitionClient();
        taskList.push(
            definitionClient.getFromCacheOrServer(definitionRef.id, authToken)
                .then((definition)=> {
                    localValue.attributeDefinition = definition;
                })
        );

        return Promise.all(taskList)
            .then(()=> {
                return localValue;
            });
    }


    static fromLocalAttributeValue(localValue:LocalAttributeValue):AttributeValue {
        var attrValue = new AttributeValue();
        attrValue.id = localValue.id;
        attrValue.value = localValue.value;
        if (localValue.attributeDefinition != null) {
            attrValue.attributeDefinitionRef = new AttributeDefinitionRef(localValue.attributeDefinition.id);
        }
        return attrValue;
    }
}