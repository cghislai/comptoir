/**
 * Created by cghislai on 07/08/15.
 */
import {Inject} from 'angular2/angular2';

import {Country, CountryFactory} from 'client/domain/country';
import {Company, CompanyRef, CompanyFactory} from 'client/domain/company';
import {EmployeeRef, Employee, EmployeeFactory} from 'client/domain/employee';
import {Auth, Registration, AuthFactory} from 'client/domain/auth';
import {Language} from 'client/utils/lang';
import {JSONFactory} from 'client/utils/factory';
import {ComptoirRequest,ComptoirResponse} from 'client/utils/request';

import {AuthClient} from 'client/auth';
import {EmployeeClient} from 'client/employee';
import {CompanyClient} from 'client/company';
import {CountryClient} from 'client/country';

import {ApplicationService} from 'services/application';

import {MD5} from 'components/auth/md5';

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
    loaded: boolean;
    loadingRequest:ComptoirRequest;
    registrationRequest: ComptoirRequest;

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

    login(login:string, hashedPassword:string):Promise<any> {
        var thisService = this;
        return this.client.login(login, hashedPassword)
            .then((response:Auth) => {
                this.saveAuth(response);
                var employeeRef = response.employeeRef;
                return this.fetchEmployeeData(employeeRef);
            });
    }

    // Register then log in
    register(registration:Registration):Promise<Employee> {
        if (this.registrationRequest != null) {
            console.log("Registration already running");
            return;
        }
        this.registrationRequest = this.client.getRegisterRequest(registration);
        return this.registrationRequest.run()
            .then((response:ComptoirResponse)=> {
                var companyRef = JSON.parse(response.text);
                console.log('Successfully registered for company #' + companyRef.id);
                var login = registration.employee.login;
                var password = registration.employeePassword;
                var hashedPassword = MD5.encode(password);
                return this.login(login, hashedPassword);
            }).then(()=>{
                return this.loggedEmployee;
            }).catch((error)=> {
                this.applicationService.handleRequestError(error);
                return null;
            });
    }


    private fetchEmployeeData(employeeRef:EmployeeRef) {
        this.fetchEmployee(employeeRef.id)
            .then(()=> {
                var companyId = this.loggedEmployee.companyRef.id;
                return this.fetchCompany(companyId);
            }).then(()=> {
                var countryCode = this.employeeCompany.countryRef.code;
                return this.fetchCountry(countryCode);
            }).then(()=>{
                this.loaded = true;
            }).catch((error)=> {
                this.applicationService.handleRequestError(error);
            });
    }

    private fetchEmployee(employeeId:number) {
        if (this.loadingRequest != null) {
            this.loadingRequest.discardRequest();
        }
        this.loadingRequest = this.employeeClient.getGetEmployeeRequest(employeeId, this.authToken);
        return this.loadingRequest.run()
            .then((response:ComptoirResponse)=> {
                var employee = JSON.parse(response.text, EmployeeFactory.fromJSONEmployeeReviver);
                this.loadingRequest = null;
                this.loggedEmployee = employee;
            });
    }

    private fetchCompany(companyId:number) {
        if (this.loadingRequest != null) {
            this.loadingRequest.discardRequest();
        }
        this.loadingRequest = this.companyClient.getGetCompanyRequest(companyId, this.authToken);
        return this.loadingRequest.run()
            .then((response:ComptoirResponse)=> {
                var company = JSON.parse(response.text, CompanyFactory.fromJSONCompanyReviver);
                this.loadingRequest = null;
                this.employeeCompany = company;
            });
    }

    private fetchCountry(countryCode:string) {
        if (this.loadingRequest != null) {
            this.loadingRequest.discardRequest();
        }
        this.loadingRequest = this.countryClient.getGetCountryrequest(countryCode, this.authToken);
        return this.loadingRequest.run()
            .then((response:ComptoirResponse) => {
                var country = JSON.parse(response.text, CountryFactory.fromJSONCountryReviver);
                this.loadingRequest = null;
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
            this.loggedEmployee = null;
            this.employeeCompany = null;
            this.companyCountry = null;
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

    checkLoggedIn():boolean {
        if (this.auth == null) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRequiredReason.NO_SESSION;
            return false;
        }
        var expireDate = this.auth.expirationDateTime;
        if (!this.isExpireDateValid(expireDate)) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRequiredReason.SESSION_EXPIRED;
            return false;
        }

        this.loginRequired = false;
        this.loginRequiredReason = null;

        this.checkRefreshToken();
        return true;
    }

}
