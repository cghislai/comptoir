/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from './company';

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
    static fromJSONReviver = (key, value)=> {
        return value;
    }

}