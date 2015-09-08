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
            jsonReviver: EmployeeFactory.fromJSONEmployeeReviver,
            cache: EmployeeFactory.cache
        });
    }
}

export class EmployeeRef {
    id: number;
    link: string;
    constructor(id?: number) {
        this.id = id;
    }
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

    static cache: {[id: number] : Employee} = {};
    static putInCache(employee: Employee) {
        var employeeId = employee.id;
        if (employeeId == null) {
            throw 'no id';
        }
        EmployeeFactory.cache[employeeId] = employee;
    }

    static getFromCache(id: number) {
        return EmployeeFactory.cache[id];
    }

    static clearFromCache(id: number) {
        delete EmployeeFactory.cache[id];
    }

    static clearCache() {
        EmployeeFactory.cache = {};
    }
}