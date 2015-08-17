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

export class Auth {
    id: number
    employeeRef:EmployeeRef;
    token:string;
    refreshToken: string;
    expirationDateTime: Date;
}

export class AuthFactory {
    static fromJSONAuthReviver = (key, value)=> {
        if (key == 'expirationDateTime') {
            return new Date(value);
        }
        return value;
    };
}