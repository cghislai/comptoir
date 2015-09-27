/**
 * Created by cghislai on 08/09/15.
 */

import {Employee} from 'client/domain/employee';
import {Company, CompanyRef, CompanyClient, CompanyFactory} from 'client/domain/company';
import {LocalCompany, LocalCompanyFactory} from 'client/localDomain/company';

export class LocalEmployee {
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
        var localEmployee = new LocalEmployee();
        return LocalEmployeeFactory.updateLocalEmployee(localEmployee, employee, authToken);
    }

    static updateLocalEmployee(localEmployee:LocalEmployee, employee:Employee, authToken:string):Promise<LocalEmployee> {
        localEmployee.active = employee.active;
        localEmployee.firstName= employee.firstName;
        localEmployee.id = employee.id;
        localEmployee.lastName = employee.lastName;
        localEmployee.locale = employee.locale;
        localEmployee.login= employee.login;

        var taskList = [];
        var companyRef = employee.companyRef;
        taskList.push(
            LocalEmployeeFactory.companyClient.getFromCacheOrServer(companyRef.id, authToken)
                .then((company)=> {
                    return LocalCompanyFactory.toLocalCompany(company, authToken);
                }).then((localCompany: LocalCompany)=>{
                    localEmployee.company = localCompany;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
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