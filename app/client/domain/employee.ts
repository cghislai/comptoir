/**
 * Created by cghislai on 07/08/15.
 */

import {CompanyRef} from './company';
import {BasicClient, BasicCacheHandler, BasicClientResourceInfo} from '../utils/basicClient';


export class EmployeeClient extends BasicClient<Employee> {

    private static RESOURCE_PATH:string = "/employee";
    constructor() {
        super(<BasicClientResourceInfo<Employee>>{
            resourcePath: EmployeeClient.RESOURCE_PATH,
            jsonReviver: EmployeeFactory.fromJSONEmployeeReviver,
            cacheHandler: EmployeeFactory.cacheHandler
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
    static cacheHandler = new BasicCacheHandler<Employee>();
    static fromJSONEmployeeReviver = (key,value)=>{
        return value;
    }

}