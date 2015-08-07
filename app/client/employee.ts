/**
 * Created by cghislai on 07/08/15.
 */


import {ComptoirrRequest} from 'client/utils/request';
import {EmployeeRef,EmployeeSearch, Employee, EmployeeFactory} from 'client/domain/employee';
import {SearchResult} from 'client/utils/searchResult';

export class EmployeeClient {
    private static serviceUrl:string = "http://somewhere.com/employee";

    private getEmployeeUrl(id:number) {
        return EmployeeClient.serviceUrl + "/" + id;
    }

    getEmployee(id:number):Promise<Employee> {
        var thisClient = this;
        var url = this.getEmployeeUrl(id);
        var request = new ComptoirrRequest();
        return request.get(url)
            .then(function (response) {
                var employee = EmployeeFactory.getEmployeeFromJSON(response.json);
                return employee;
            });
    }

    searchEmployee(search:EmployeeSearch):Promise<SearchResult<Employee>> {
        var thisClient = this;
        var url = EmployeeClient.serviceUrl + '/search';
        var searchJSON = JSON.stringify(search);
        var request = new ComptoirrRequest();
        return request.post(searchJSON, url)
            .then(function (response) {
                var result = new SearchResult<Employee>().parseResponse(response, EmployeeFactory.getEmployeeFromJSON);
                return result;
            });
    }

    createEmployee(employee:Employee):Promise<EmployeeRef> {
        var thisClient = this;
        var url = EmployeeClient.serviceUrl;
        var employeeJSON = JSON.stringify(employee);
        var request = new ComptoirrRequest();
        return request.post(employeeJSON, url)
            .then(function (response) {
                var employeeRef = EmployeeFactory.getEmployeeRefFromJSON(response.json);
                return employeeRef;
            });
    }

    updateEmployee(employee:Employee):Promise<EmployeeRef> {
        var thisClient = this;
        var url = this.getEmployeeUrl(employee.id);
        var employeeJSON = JSON.stringify(employee);
        var request = new ComptoirrRequest();
        return request.put(employeeJSON, url)
            .then(function (response) {
                var employeeRef = EmployeeFactory.getEmployeeRefFromJSON(response.json);
                return employeeRef;
            });
    }

}