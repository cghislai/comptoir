/**
 * Created by cghislai on 07/08/15.
 */
import {Inject} from 'angular2/angular2';

import {CompanyRef} from 'client/domain/company';
import {EmployeeRef, Employee} from 'client/domain/employee';
import {LoginResponse, Registration} from 'client/domain/auth';
import {Language} from 'client/utils/lang';

import {AuthClient} from 'client/auth';
import {EmployeeClient} from 'client/employee';

import {ApplicationService} from 'services/application';

export enum LoginRequiredReason {
    NO_SESSION,
    SESSION_EXPIRED
}

export class AuthService {
    static STORAGE_TOKEN_KEY = "AuthToken";

    client:AuthClient;
    employeeClient:EmployeeClient;
    applicationService:ApplicationService;

    loggedEmployee:Employee;
    authToken:string;
    // TODO
    authTokenExpireDate:Date;

    loginRequired:boolean;
    loginRequiredReason:LoginRequiredReason;

    constructor(@Inject appService:ApplicationService) {
        this.client = new AuthClient();
        this.employeeClient = new EmployeeClient();
        this.applicationService = appService;

        this.authToken = localStorage.getItem(AuthService.STORAGE_TOKEN_KEY);
        this.authTokenExpireDate = null;
    }

    login(login:string, password:string):Promise<Employee> {
        var thisService = this;
        return this.client.login(login, password)
            .then((response:LoginResponse) => {
                var authToken = response.authToken;
                thisService.saveAuthToken(authToken);

                var employeeId = response.employeeRef.id;
                return thisService.employeeClient.getEmployee(employeeId, authToken);
            }).then((employee:Employee) => {
                thisService.loggedEmployee = employee;
                return employee;
            });
    }

    // Register then log in
    register(registration:Registration):Promise<Employee> {
        var thisService = this;
        return this.client.register(registration)
            .then((companyRef: CompanyRef)=> {
                console.log('Sucessfully registerd for company #'+companyRef.id);
                var login = registration.employee.login;
                var password = registration.employeePassword;
                return thisService.login(login, password);
            });
    }

    private saveAuthToken(token:string) {
        this.authToken = token;
        localStorage.setItem(AuthService.STORAGE_TOKEN_KEY, token);
    }


    checkLoginRequired() {
        if (this.authToken == undefined) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRequiredReason.NO_SESSION;
            return true;
        }
        var expireDate = this.authTokenExpireDate;
        if (expireDate == null) {
            return true;
        }
        if (expireDate == undefined) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRequiredReason.NO_SESSION;
            return true;
        }
        if (Date.now() >= expireDate.getTime()) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRequiredReason.SESSION_EXPIRED;
            return true;
        }
        this.loginRequired = false;
        this.loginRequiredReason = null;
        return false;
    }

}