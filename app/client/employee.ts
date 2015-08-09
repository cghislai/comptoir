/**
 * Created by cghislai on 07/08/15.
 */


import {EmployeeRef,EmployeeSearch, Employee, EmployeeFactory} from 'client/domain/employee';
import {ComptoirrRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/searchResult';

export class EmployeeClient {
    private static serviceUrl:string = "http://somewhere.com/employee";

    private getEmployeeUrl(id:number) {
        return EmployeeClient.serviceUrl + "/" + id;
    }


    createEmployee(employee:Employee, authToken: string):Promise<EmployeeRef> {
        var url = EmployeeClient.serviceUrl;
        var request = new ComptoirrRequest();
        return request.post(employee, url, authToken)
            .then(function (response) {
                var employeeRef = JSON.parse(response.text);
                return employeeRef;
            });
    }

    updateEmployee(employee:Employee, authToken: string):Promise<EmployeeRef> {
        var url = this.getEmployeeUrl(employee.id);
        var request = new ComptoirrRequest();
        return request.put(employee, url, authToken)
            .then(function (response) {
                var employeeRef = JSON.parse(response.text);
                return employeeRef;
            });
    }

    getEmployee(id:number, authToken: string):Promise<Employee> {
        var url = this.getEmployeeUrl(id);
        var request = new ComptoirrRequest();
        return request.get(url, authToken)
            .then(function (response) {
                var employee = JSON.parse(response.text, EmployeeFactory.fromJSONEmployeeReviver);
                return employee;
            });
    }

    searchEmployee(search:EmployeeSearch, authToken: string):Promise<SearchResult<Employee>> {
        var url = EmployeeClient.serviceUrl + '/search';
        var request = new ComptoirrRequest();
        return request.post(search, url, authToken)
            .then(function (response) {
                var result = new SearchResult<Employee>().parseResponse(response, EmployeeFactory.fromJSONEmployeeReviver);
                return result;
            });
    }


}