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
}

export class EmployeeFactory {
    static getEmployeeRefFromJSON(jsonObject: any): EmployeeRef {
        if (jsonObject == undefined) {
            return undefined;
        }
        var employeeRef = new EmployeeRef;
        employeeRef.id = jsonObject.id;
        employeeRef.link = jsonObject.link;
        return employeeRef;
    }

    static getEmployeeFromJSON(jsonObject: any):Employee {
        if (jsonObject == undefined) {
            return undefined;
        }
        var employee = new Employee();
        employee.active = jsonObject.active;
        employee.companyRef = EmployeeFactory.getEmployeeRefFromJSON(jsonObject.companyRef);
        employee.firstName = jsonObject.firstName;
        employee.id = jsonObject.id;
        employee.lastName = jsonObject.lastName;
        employee.locale = jsonObject.locale;
        employee.login = jsonObject.login;
        return employee;
    }
}