/**
 * Created by cghislai on 07/08/15.
 */

import {CompanyRef} from './company';


export class EmployeeRef {
    id:number;
    link:string;

    constructor(id?:number) {
        this.id = id;
    }
}

export class Employee {
    id:number;
    active:boolean;
    companyRef:CompanyRef;
    login:string;
    firstName:string;
    lastName:string;
    locale:string;
}

export class EmployeeSearch {

}

export class EmployeeFactory {
    static fromJSONReviver = (key, value)=> {
        return value;
    };

}