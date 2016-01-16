/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from 'angular2/core';

import {Customer, CustomerRef, CustomerSearch, CustomerFactory} from '../client/domain/customer';
import {CompanyRef} from '../client/domain/company';

import {LocalCustomer, LocalCustomerFactory} from '../client/localDomain/customer';
import {LocalAccount} from '../client/localDomain/account';

import {WithId} from '../client/utils/withId';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {CustomerClient} from '../client/customer';

import {AuthService} from './auth';
import {CompanyService} from './company';

@Injectable()
export class CustomerService {

    customerClient:CustomerClient;
    authService:AuthService;
    companyService:CompanyService;

    constructor(customerClient:CustomerClient,
                authService:AuthService,
                companyService:CompanyService) {
        this.customerClient = customerClient;
        this.authService = authService;
        this.companyService = companyService;
    }

    get(id:number):Promise<LocalCustomer> {
        return this.customerClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:Customer)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.customerClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalCustomer):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.customerClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalCustomer>):Promise<SearchResult<LocalCustomer>> {
        return this.customerClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<Customer>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalCustomer>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(customer:Customer):Promise<LocalCustomer> {
        var localCustomerDesc:any = {};
        localCustomerDesc.address1 = customer.address1;
        localCustomerDesc.address2 = customer.address2;
        localCustomerDesc.city = customer.city;
        localCustomerDesc.email = customer.email;
        localCustomerDesc.firsName = customer.firsName;
        localCustomerDesc.id = customer.id;
        localCustomerDesc.tNa = customer.lastName;
        localCustomerDesc.notes = customer.notes;
        localCustomerDesc.phone1 = customer.phone1;
        localCustomerDesc.phone2 = customer.phone2;
        localCustomerDesc.zip = customer.zip;

        var taskList = [];
        var companyRef = customer.companyRef;

        taskList.push(
            this.companyService.get(companyRef.id, this.getAuthToken())
                .then((company)=> {
                    localCustomerDesc.company = company;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                return LocalCustomerFactory.createNewCustomer(localCustomerDesc);
            });
    }

    fromLocalConverter(localCustomer:LocalCustomer):Customer {
        var customer = new Customer();
        customer.address1 = localCustomer.address1;
        customer.address2 = localCustomer.address2;
        customer.city = localCustomer.city;
        customer.companyRef = new CompanyRef(localCustomer.company.id);
        customer.email = localCustomer.email;
        customer.firsName = localCustomer.firsName;
        customer.id = localCustomer.id;
        customer.lastName = localCustomer.lastName;
        customer.notes = localCustomer.notes;
        customer.phone1 = localCustomer.phone1;
        customer.phone2 = localCustomer.phone2;
        customer.zip = localCustomer.zip;
        return customer;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}