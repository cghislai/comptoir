/**
 * Created by cghislai on 07/08/15.
 */
import {Inject} from 'angular2/angular2';

import {Company, CompanyRef} from 'client/domain/company';
import {Country} from 'client/domain/country';
import {EmployeeRef, Employee, EmployeeFactory} from 'client/domain/employee';
import {Auth, Registration, AuthFactory} from 'client/domain/auth';
import {Language} from 'client/utils/lang';
import {JSONFactory} from 'client/utils/factory';

import {AuthClient} from 'client/auth';
import {EmployeeClient} from 'client/employee';
import {CompanyClient} from 'client/company';
import {CountryClient} from 'client/country';

import {ApplicationService} from 'services/application';

export enum LoginRequiredReason {
    NO_SESSION,
    SESSION_EXPIRED
}

export class AuthService {
    static STORAGE_AUTH_KEY = "Auth";

    client:AuthClient;
    employeeClient:EmployeeClient;
    applicationService:ApplicationService;
    companyClient:CompanyClient;
    countryClient:CountryClient;

    authToken:string;
    auth:Auth;
    loggedEmployee:Employee;
    employeeCompany:Company;
    companyCountry:Country;

    loginRequired:boolean;
    loginRequiredReason:LoginRequiredReason;

    constructor(@Inject appService:ApplicationService) {
        this.applicationService = appService;
        this.client = new AuthClient();
        this.employeeClient = new EmployeeClient();
        this.companyClient = new CompanyClient();
        this.countryClient = new CountryClient();

        this.loadFromStorage();
    }

    login(login:string, password:string):Promise<Employee> {
        var thisService = this;
        return this.client.login(login, password)
            .then((response:Auth) => {
                this.saveAuth(response);
                var employeeRef = response.employeeRef;
                return this.fetchEmployeeData(employeeRef);
            });
    }

    // Register then log in
    register(registration:Registration):Promise<Employee> {
        var thisService = this;
        return this.client.register(registration)
            .then((companyRef:CompanyRef)=> {
                console.log('Successfully registered for company #' + companyRef.id);
                var login = registration.employee.login;
                var password = registration.employeePassword;
                return thisService.login(login, password);
            });
    }


    private fetchEmployeeData(employeeRef:EmployeeRef) {
        return this.fetchEmployee(employeeRef.id)
            .then(()=> {
                var companyId = this.loggedEmployee.companyRef.id;
                return this.fetchCompany(companyId);
            }).then(()=> {
                var countryCode = this.employeeCompany.countryRef.code;
                return this.fetchCountry(countryCode);
            });
    }

    private fetchEmployee(employeeId:number) {
        return this.employeeClient.getEmployee(employeeId, this.authToken)
            .then((employee:Employee)=> {
                this.loggedEmployee = employee;
            });
    }

    private fetchCompany(companyId:number) {
        return this.companyClient.getCompany(companyId, this.authToken)
            .then((company:Company)=> {
                this.employeeCompany = company;
            });
    }

    private fetchCountry(countryCode:string) {
        return this.countryClient.getCountry(countryCode, this.authToken)
            .then((country:Country)=> {
                this.companyCountry = country;
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
        }
    }


    private loadFromStorage() {
        this.auth = null;
        this.authToken = null;

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
        var employeeRef = this.auth.employeeRef;

        this.fetchEmployeeData(employeeRef);
        this.checkRefreshToken();
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
        var remainingMs = expireTime - nowTime;
        var tenMinutesMs = 10 * 60 * 1000;
        return remainingMs < tenMinutesMs;
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