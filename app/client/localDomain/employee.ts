/**
 * Created by cghislai on 08/09/15.
 */

import {Employee} from '../domain/employee';
import {Company, CompanyRef, CompanyClient, CompanyFactory} from '../domain/company';

import {LocalCompany, LocalCompanyFactory} from './company';

import {Map, Record} from 'immutable';

export interface LocalEmployee extends Map<string, any> {
    id: number;
    active: boolean;
    company: LocalCompany;
    login: string;
    firstName: string;
    lastName: string;
    locale: string;
}
var EmployeeRecord = Record({
    id: null,
    active: null,
    company: null,
    login: null,
    firstName: null,
    lastName: null,
    locale: null
});
export function NewEmployee(desc: any) : LocalEmployee {
    return <any>EmployeeRecord(desc);
}

export class LocalEmployeeFactory {
    static companyClient = new CompanyClient();

    static toLocalEmployee(employee:Employee, authToken:string):Promise<LocalEmployee> {
        var localEmployeeDesc:any = {};
        localEmployeeDesc.active = employee.active;
        localEmployeeDesc.firstName = employee.firstName;
        localEmployeeDesc.id = employee.id;
        localEmployeeDesc.lastName = employee.lastName;
        localEmployeeDesc.locale = employee.locale;
        localEmployeeDesc.login = employee.login;

        var taskList = [];
        var companyRef = employee.companyRef;
        taskList.push(
            LocalEmployeeFactory.companyClient.getFromCacheOrServer(companyRef.id, authToken)
                .then((company)=> {
                    return LocalCompanyFactory.toLocalCompany(company, authToken);
                }).then((localCompany:LocalCompany)=> {
                    localEmployeeDesc.company = localCompany;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
               return NewEmployee(localEmployeeDesc);
            });
    }

    static fromLocalEmployee(localEmployee:LocalEmployee):Employee {
        var employee = new Employee();
        employee.active = localEmployee.active;
        if (localEmployee.company != null) {
            employee.companyRef = new CompanyRef(localEmployee.company.id);
        }
        employee.firstName = localEmployee.firstName;
        employee.id = localEmployee.id;
        employee.lastName = localEmployee.lastName;
        employee.locale = localEmployee.locale;
        employee.login = localEmployee.login;
        return employee;
    }

}