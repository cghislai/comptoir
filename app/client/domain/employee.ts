/**
 * Created by cghislai on 07/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {BasicClient, BasicClientResourceInfo} from 'client/utils/basicClient';


export class EmployeeClient extends BasicClient<Employee> {

    private static RESOURCE_PATH:string = "/employee";
    constructor() {
        super({
            resourcePath: EmployeeClient.RESOURCE_PATH,
            jsonReviver: EmployeeFactory.fromJSONEmployeeReviver
        });
    }
}

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