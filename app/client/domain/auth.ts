/**
 * Created by cghislai on 07/08/15.
 */

import {Company, CompanyRef} from 'client/domain/company';
import {Employee, EmployeeRef} from 'client/domain/employee';

export class Registration {
    company:Company;
    employee:Employee;
    employeePassword:string;
}

export class LoginResponse {
    employeeRef:EmployeeRef;
    authToken:string;
}

export class AuthFactory {
    static fromJSONLoginResponseReviver = (key, value)=> {
        return value;
    };
}