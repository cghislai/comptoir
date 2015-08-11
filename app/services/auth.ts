/**
 * Created by cghislai on 07/08/15.
 */
import {Inject} from 'angular2/angular2';

import {CompanyRef} from 'client/domain/company';
import {EmployeeRef, Employee, EmployeeFactory} from 'client/domain/employee';
import {LoginResponse, Registration} from 'client/domain/auth';
import {Language} from 'client/utils/lang';
import {JSONFactory} from 'client/utils/factory';

import {AuthClient} from 'client/auth';
import {EmployeeClient} from 'client/employee';

import {ApplicationService} from 'services/application';

export enum LoginRequiredReason {
    NO_SESSION,
    SESSION_EXPIRED
}

export class AuthService {
    static STORAGE_TOKEN_KEY = "AuthToken";
    static STORAGE_TOKEN_EXPIRE_DATE_KEY = "AuthTokenExpireDate";
    static STORAGE_EMPLOYEE_ID_KEY = "EmployeeId";
    static STORAGE_EMPLOYEE_KEY = "Employee";

    client:AuthClient;
    employeeClient:EmployeeClient;
    applicationService:ApplicationService;

    authToken:string;
    loggedEmployeeId:number;
    loggedEmployee:Employee;
    // TODO
    authTokenExpireDate:Date;

    loginRequired:boolean;
    loginRequiredReason:LoginRequiredReason;

    constructor(@Inject appService:ApplicationService) {
        this.client = new AuthClient();
        this.employeeClient = new EmployeeClient();
        this.applicationService = appService;

        this.loadFromStorage();

    }

    login(login:string, password:string):Promise<Employee> {
        var thisService = this;
        return this.client.login(login, password)
            .then((response:LoginResponse) => {
                var authToken = response.authToken;
                // FIXME: false expire date
                var expireDate = new Date();
                expireDate.setHours(expireDate.getHours() + 1);
                thisService.saveAuthToken(authToken, expireDate);
                var employeeId = response.employeeRef.id;
                thisService.saveLoggedEmployeeId(employeeId);
                return thisService.employeeClient.getEmployee(employeeId, authToken);
            }).then((employee:Employee) => {
                thisService.saveLoggedEmployee(employee);
                return employee;
            });
    }

    // Register then log in
    register(registration:Registration):Promise<Employee> {
        var thisService = this;
        return this.client.register(registration)
            .then((companyRef:CompanyRef)=> {
                console.log('Sucessfully registerd for company #' + companyRef.id);
                var login = registration.employee.login;
                var password = registration.employeePassword;
                return thisService.login(login, password);
            });
    }

    private saveAuthToken(token:string, expireDate:Date) {
        this.authToken = token;
        localStorage.setItem(AuthService.STORAGE_TOKEN_KEY, token);

        this.authTokenExpireDate = expireDate;
        if (expireDate != undefined) {
            var dateJSON = expireDate.toJSON();
            localStorage.setItem(AuthService.STORAGE_TOKEN_EXPIRE_DATE_KEY, dateJSON);
        } else {
            localStorage.setItem(AuthService.STORAGE_TOKEN_EXPIRE_DATE_KEY, undefined);
        }
    }

    private saveLoggedEmployeeId(id:number) {
        this.loggedEmployeeId = id;
        localStorage.setItem(AuthService.STORAGE_EMPLOYEE_ID_KEY, id + '');
    }

    private saveLoggedEmployee(employee:Employee) {
        this.loggedEmployee = employee;
        var employeeJSON = JSON.stringify(employee, JSONFactory.toJSONReplacer);
        localStorage.setItem(AuthService.STORAGE_EMPLOYEE_KEY, employeeJSON);
    }

    private loadFromStorage() {
        this.authToken = undefined;
        this.authTokenExpireDate = undefined;
        this.loggedEmployeeId = undefined;
        this.loggedEmployee = undefined;

        this.authToken = localStorage.getItem(AuthService.STORAGE_TOKEN_KEY);
        var authTokenExpireDateJSON = localStorage.getItem(AuthService.STORAGE_TOKEN_EXPIRE_DATE_KEY);
        this.authTokenExpireDate = new Date(authTokenExpireDateJSON);

        if (this.authToken != null) {
            if (!this.isExpireDateValid(this.authTokenExpireDate)) {
                this.saveAuthToken(undefined, undefined);
                return;
            }
            // Load data
            var idString = localStorage.getItem(AuthService.STORAGE_EMPLOYEE_ID_KEY);
            this.loggedEmployeeId = parseInt(idString);
            var employeeJSON = localStorage.getItem(AuthService.STORAGE_EMPLOYEE_KEY);
            this.loggedEmployee = JSON.parse(employeeJSON, EmployeeFactory.fromJSONEmployeeReviver);

            if (this.loggedEmployeeId != null && this.loggedEmployee == null) {
                var thisService = this;
                this.employeeClient.getEmployee(this.loggedEmployeeId, this.authToken)
                    .then((employee)=> {
                        thisService.saveLoggedEmployee(employee);
                    });
            }
        }
    }

    isExpireDateValid(date:Date) {
        // Handle null case
        if (date == undefined) {
            return false;
        }
        var nowDate = Date.now();
        return nowDate < date.getTime();
    }

    checkLoginRequired() {
        if (this.authToken == undefined) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRequiredReason.NO_SESSION;
            return true;
        }
        var expireDate = this.authTokenExpireDate;
        if (!this.isExpireDateValid(expireDate)) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRequiredReason.SESSION_EXPIRED;
            return true;
        }
        this.loginRequired = false;
        this.loginRequiredReason = null;
        return false;
    }

}