/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {BasicClient, BasicCacheHandler, BasicClientResourceInfo} from 'client/utils/basicClient';

export class CustomerClient extends BasicClient<Customer> {

    private static RESOURCE_PATH:string = "/customer";

    constructor() {
        super(<BasicClientResourceInfo<Customer>>{
            resourcePath: CustomerClient.RESOURCE_PATH,
            jsonReviver: CustomerFactory.fromJSONCustomerReviver,
            cacheHandler: CustomerFactory.cacheHandler
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
    static cacheHandler = new BasicCacheHandler<Customer>();
    static fromJSONCustomerReviver = (key, value)=> {
        return value;
    }

}