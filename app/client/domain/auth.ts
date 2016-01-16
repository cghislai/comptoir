/**
 * Created by cghislai on 07/08/15.
 */

import {Company, CompanyRef} from './company';
import {Employee, EmployeeRef} from './employee';

export class Registration {
    company:Company;
    employee:Employee;
    employeePassword:string;
}

export class Auth {
    id: number;
    employeeRef:EmployeeRef;
    token:string;
    refreshToken: string;
    expirationDateTime: Date;
}

export class AuthFactory {
    static fromJSONReviver = (key, value)=> {
        if (key ==='expirationDateTime') {
            return new Date(value);
        }
        return value;
    };

}