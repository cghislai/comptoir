/**
 * Created by cghislai on 07/08/15.
 */

import {CompanyRef} from 'client/domain/company';

export class EmployeeRef {
    id: number;
    link: string;
}

export class Employee {
    id: number;
    active: boolean;
    companyRef: CompanyRef;
    login: string;
    firstName: string;
    lastName: string;
    locale: string;

    getFullName(): string {
        return this.firstName+' '+this.lastName;
    }
}

export class EmployeeSearch {

}

export class EmployeeFactory {
    static fromJSONEmployeeReviver = (key,value)=>{
        return value;
    }
}