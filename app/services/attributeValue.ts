/**
 * Created by cghislai on 29/07/15.
 */
import {Injectable} from 'angular2/core';

import {AttributeValue, AttributeValueRef, AttributeValueFactory} from '../client/domain/attributeValue';
import {AttributeDefinitionRef} from '../client/domain/attributeDefinition';
import {Account, AccountType, AccountRef} from '../client/domain/account';
import {Company, CompanyRef} from '../client/domain/company';
import {Customer,CustomerRef} from '../client/domain/customer';

import {LocalAttributeValue, LocalAttributeValueFactory} from '../client/localDomain/attributeValue';
import {LocalAttributeDefinition, LocalAttributeDefinitionFactory} from '../client/localDomain/attributeDefinition';
import {LocalAccount} from '../client/localDomain/account';

import {WithId} from '../client/utils/withId';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {AttributeValueClient} from '../client/attributeValue';

import {AuthService} from './auth';
import {AttributeDefinitionService} from './attributeDefinition';

@Injectable()
export class AttributeValueService {

    attributeValueClient:AttributeValueClient;
    authService:AuthService;
    attributeDefinitionService:AttributeDefinitionService;

    constructor(attributeValueClient:AttributeValueClient,
                authService:AuthService,
                attribureDefinitionService:AttributeDefinitionService) {
        this.attributeValueClient = attributeValueClient;
        this.authService = authService;
        this.attributeDefinitionService = attribureDefinitionService;

    }

    get(id:number):Promise<LocalAttributeValue> {
        return this.attributeValueClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:AttributeValue)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.attributeValueClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalAttributeValue):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.attributeValueClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalAttributeValue>):Promise<SearchResult<LocalAttributeValue>> {
        return this.attributeValueClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<AttributeValue>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalAttributeValue>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    fromLocalConverter(localAttributeValue:LocalAttributeValue):AttributeValue {
        var attrValue = new AttributeValue();
        attrValue.id = localAttributeValue.id;
        attrValue.value = localAttributeValue.value;
        if (localAttributeValue.attributeDefinition != null) {
            attrValue.attributeDefinitionRef = new AttributeDefinitionRef(localAttributeValue.attributeDefinition.id);
        }
        return attrValue;
    }

    toLocalConverter(attributeValue:AttributeValue):Promise<LocalAttributeValue> {
        var localValueDesc:any = {};
        localValueDesc.id = attributeValue.id;
        localValueDesc.value = attributeValue.value;

        var taskList = [];
        var definitionRef = attributeValue.attributeDefinitionRef;

        taskList.push(
            this.attributeDefinitionService.get(definitionRef.id)
                .then((definition)=> {
                    localValueDesc.attributeDefinition = definition;
                })
        );

        return Promise.all(taskList)
            .then(()=> {
                return LocalAttributeValueFactory.createAttributeValue(localValueDesc);
            });
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}