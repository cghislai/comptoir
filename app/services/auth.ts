/**
 * Created by cghislai on 07/08/15.
 */
import {Inject} from 'angular2/angular2';

import {CompanyRef} from 'client/domain/company';
import {EmployeeRef, Employee, EmployeeFactory} from 'client/domain/employee';
import {Auth, Registration, AuthFactory} from 'client/domain/auth';
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
    static STORAGE_AUTH_KEY = "Auth";
    static STORAGE_EMPLOYEE_KEY = "Employee";

    client:AuthClient;
    employeeClient:EmployeeClient;
    applicationService:ApplicationService;

    authToken:string;
    auth:Auth;
    loggedEmployee:Employee;

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
            .then((response:Auth) => {
                this.saveAuth(response);
                var employeeId = response.employeeRef.id;
                return this.employeeClient.getEmployee(employeeId, this.authToken);
            }).then((employee:Employee) => {
                this.saveLoggedEmployee(employee);
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

    private saveAuth(auth:Auth) {
        this.auth = auth;
        if (auth != null) {
            this.authToken = auth.token;
            var jsonString = JSON.stringify(auth, JSONFactory.toJSONReplacer);
            localStorage.setItem(AuthService.STORAGE_AUTH_KEY, jsonString);
        } else {
            this.authToken = null;
            localStorage.setItem(AuthService.STORAGE_AUTH_KEY, null);
            localStorage.setItem(AuthService.STORAGE_EMPLOYEE_KEY, null);
        }
    }

    private saveLoggedEmployee(employee:Employee) {
        this.loggedEmployee = employee;
        var employeeJSON = JSON.stringify(employee, JSONFactory.toJSONReplacer);
        localStorage.setItem(AuthService.STORAGE_EMPLOYEE_KEY, employeeJSON);
    }

    private loadFromStorage() {
        this.auth = null;
        this.authToken = null;
        this.loggedEmployee = null;

        var authJSON = localStorage.getItem(AuthService.STORAGE_AUTH_KEY);
        if (authJSON == null) {
            return;
        }
        var auth:Auth = JSON.parse(authJSON, AuthFactory.fromJSONAuthReviver);

        if (auth == null) {
            this.saveAuth(null);
            return;
        }
        var expireDate = auth.expirationDateTime;
        if (!this.isExpireDateValid(expireDate)) {
            this.saveAuth(null);
            return;
        }
        this.auth = auth;
        this.authToken = auth.token;

        var employeeId = this.auth.employeeRef.id;
        var employeeJSON = localStorage.getItem(AuthService.STORAGE_EMPLOYEE_KEY);
        if (employeeJSON == null) {
            this.fetchEmployee();
        } else {
            var employee = JSON.parse(employeeJSON, EmployeeFactory.fromJSONEmployeeReviver);
            if (employee.id == employeeId) {
                this.loggedEmployee = employee;
            } else {
                this.fetchEmployee();
            }
        }

        this.checkRefreshToken();
    }

    fetchEmployee() {
        var employeeId = this.auth.employeeRef.id;
        var authToken = this.authToken;
        return this.employeeClient.getEmployee(employeeId, authToken)
            .then((employee)=> {
                this.saveLoggedEmployee(employee);
            });
    }

    isExpireDateValid(date:Date) {
        // Handle null case
        if (date == undefined) {
            return false;
        }
        var nowDate = Date.now();
        return nowDate < date.getTime();
    }

    isExpireDateGettingClose(date:Date) {
        if (date == null) {
            return false;
        }
        var nowTime = Date.now();
        var expireTime = date.getTime();
        var remainigMs = expireTime - nowTime;
        var tenMinutesMs = 10 * 60 * 1000;
        return remainigMs < tenMinutesMs;
    }

    checkRefreshToken() {
        if (this.auth == null) {
            return;
        }
        var expireDate = this.auth.expirationDateTime;
        if (!this.isExpireDateGettingClose(expireDate)) {
            return;
        }
        var refreshToken = this.auth.refreshToken;
        this.client.refreshToken(refreshToken)
            .then((auth)=> {
                this.saveAuth(auth);
            });
    }

    checkLoginRequired() {
        if (this.auth == null) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRequiredReason.NO_SESSION;
            return true;
        }
        var expireDate = this.auth.expirationDateTime;
        if (!this.isExpireDateValid(expireDate)) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRequiredReason.SESSION_EXPIRED;
            return true;
        }
        if (this.loggedEmployee == null) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRequiredReason.NO_SESSION;
            return true;
        }
        this.loginRequired = false;
        this.loginRequiredReason = null;

        this.checkRefreshToken();
        return false;
    }

}