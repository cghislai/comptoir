/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {BasicClient} from 'client/utils/basicClient';

export class CustomerClient extends BasicClient<Customer> {

    private static RESOURCE_PATH:string = "/customer";

    constructor() {
        super({
            resourcePath: CustomerClient.RESOURCE_PATH,
            jsonReviver: CustomerFactory.fromJSONCustomerReviver,
            cache: CustomerFactory.cache
        });
    }
}
export class Customer {
    id: number;
    companyRef:CompanyRef;
    firsName:string;
    lastName:string;
    address1:string;
    address2:string;
    zip:string;
    city:string;
    phone1:string;
    phone2:string;
    email:string;
    notes:string;
}

export class CustomerRef {
    id:number;
    link:string;

    constructor(id?: number) {
        this.id = id;
    }
}

export class CustomerSearch {
    companyRef:CompanyRef;
}

export class CustomerFactory {
    static fromJSONCustomerReviver = (key, value)=> {
        return value;
    }

    static cache: {[id: number] : Customer} = {};
    static putInCache(custromer: Customer) {
        var custromerId = custromer.id;
        if (custromerId == null) {
            throw 'no id';
        }
        CustomerFactory.cache[custromerId] = custromer;
    }

    static getFromCache(id: number) {
        return CustomerFactory.cache[id];
    }

    static clearFromCache(id: number) {
        delete CustomerFactory.cache[id];
    }

    static clearCache() {
        CustomerFactory.cache = {};
    }

}