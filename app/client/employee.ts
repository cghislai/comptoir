/**
 * Created by cghislai on 07/08/15.
 */


import {PromiseRequest} from 'client/utils/request';
import {EmployeeRef,EmployeeSearch, Employee, EmployeeFactory} from 'client/domain/employee';

export class EmployeeClient {
    private static serviceUrl:string = "http://somewhere.com/employee";

    private getEmployeeUrl(id:number) {
        return EmployeeClient.serviceUrl + "/" + id;
    }

    getEmployee(id:number):Promise<Employee> {
        var thisClient = this;
        var url = this.getEmployeeUrl(id);
        var request = new PromiseRequest();
        return request.get(url)
            .then(function (response) {
                var employee = EmployeeFactory.getEmployeeFromJSON(response);
                return employee;
            });
    }

    searchEmployee(search:EmployeeSearch):Promise<Employee[]> {
        var thisClient = this;
        var url = EmployeeClient.serviceUrl + '/search';
        var searchJSON = JSON.stringify(search);
        var request = new PromiseRequest();
        return request.post(searchJSON, url)
            .then(function (response) {
                var employees = EmployeeFactory.getEmployeeArrayFromJSON(response);
                return employees;
            });
    }

    createEmployee(employee:Employee):Promise<EmployeeRef> {
        var thisClient = this;
        var url = EmployeeClient.serviceUrl;
        var employeeJSON = JSON.stringify(employee);
        var request = new PromiseRequest();
        return request.post(employeeJSON, url)
            .then(function (response) {
                var employeeRef = EmployeeFactory.getEmployeeRefFromJSON(response);
                return employeeRef;
            });
    }

    updateEmployee(employee:Employee):Promise<EmployeeRef> {
        var thisClient = this;
        var url = this.getEmployeeUrl(employee.id);
        var employeeJSON = JSON.stringify(employee);
        var request = new PromiseRequest();
        return request.put(employeeJSON, url)
            .then(function (response) {
                var employeeRef = EmployeeFactory.getEmployeeRefFromJSON(response);
                return employeeRef;
            });
    }

}