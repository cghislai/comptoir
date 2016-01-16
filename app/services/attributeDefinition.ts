/**
 * Created by cghislai on 29/07/15.
 */
import {Injectable} from 'angular2/core';

import {AttributeDefinition,AttributeDefinitionRef,AttributeDefinitionSearch,AttributeDefinitionFactory} from '../client/domain/attributeDefinition';
import {Account, AccountType, AccountRef} from '../client/domain/account';
import {Company, CompanyRef} from '../client/domain/company';
import {Customer,CustomerRef} from '../client/domain/customer';

import {LocalAttributeDefinition, LocalAttributeDefinitionFactory} from '../client/localDomain/attributeDefinition';
import {LocalAccount} from '../client/localDomain/account';

import {WithId} from '../client/utils/withId';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {AttributeDefinitionClient} from '../client/attributeDefinition';

import {AuthService} from './auth';
import {CompanyService} from './company';

@Injectable()
export class AttributeDefinitionService {


    attributedefinitionClient:AttributeDefinitionClient;
    authService:AuthService;
    companyService:CompanyService;

    constructor(attributedefinitionClient:AttributeDefinitionClient,
                authService:AuthService,
                companyService:CompanyService) {
        this.attributedefinitionClient = attributedefinitionClient;
        this.authService = authService;
        this.companyService = companyService;
    }

    get(id:number):Promise<LocalAttributeDefinition> {
        return this.attributedefinitionClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:AttributeDefinition)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.attributedefinitionClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalAttributeDefinition):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.attributedefinitionClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalAttributeDefinition>):Promise<SearchResult<LocalAttributeDefinition>> {
        return this.attributedefinitionClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<AttributeDefinition>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalAttributeDefinition>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    fromLocalConverter(localAttributeDefinition:LocalAttributeDefinition):AttributeDefinition {
        var attributeDefinition = new AttributeDefinition();
        if (localAttributeDefinition.company != null) {
            attributeDefinition.companyRef = new CompanyRef(localAttributeDefinition.company.id);
        }
        attributeDefinition.id = localAttributeDefinition.id;
        attributeDefinition.name = localAttributeDefinition.name;
        return attributeDefinition;
    }

    toLocalConverter(attributeDefinition:AttributeDefinition):Promise<LocalAttributeDefinition> {
        var localAttributeDefinitionDesc:any = {};
        localAttributeDefinitionDesc.id = attributeDefinition.id;
        localAttributeDefinitionDesc.name = attributeDefinition.name;

        var taskList = [];

        var companyRef = attributeDefinition.companyRef;
        var companyId = companyRef.id;

        taskList.push(
            this.companyService.get(companyId, this.getAuthToken())
                .then((company)=> {
                    localAttributeDefinitionDesc.company = company;
                })
        );

        return Promise.all(taskList)
            .then(()=> {
                return LocalAttributeDefinitionFactory.createAttributeDefinition(localAttributeDefinitionDesc);
            });
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}