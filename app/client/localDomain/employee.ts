/**
 * Created by cghislai on 08/09/15.
 */

import {Employee} from 'client/domain/employee';
import {Company, CompanyRef, CompanyClient, CompanyFactory} from 'client/domain/company';

import {LocalCompany, LocalCompanyFactory} from 'client/localDomain/company';

import {Map} from 'immutable';

export interface LocalEmployee extends Map<string, any> {
    id: number;
    active: boolean;
    company: LocalCompany;
    login: string;
    firstName: string;
    lastName: string;
    locale: string;
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
                var localEmployee:LocalEmployee;
                localEmployee = <LocalEmployee>Map(localEmployeeDesc);
                return localEmployee;
            });
    }

    static fromLocalEmployee(localEmployee:LocalEmployee):Employee {
        var employee = new Employee();
        employee.active = localEmployee.active;
        employee.companyRef = new CompanyRef(localEmployee.company.id);
        employee.firstName = localEmployee.firstName;
        employee.id = localEmployee.id;
        employee.lastName = localEmployee.lastName;
        employee.locale = localEmployee.locale;
        employee.login = localEmployee.login;
        return employee;
    }

}