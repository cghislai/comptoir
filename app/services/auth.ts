/**
 * Created by cghislai on 07/08/15.
 */
import {Inject} from 'angular2/angular2';

import {Auth, Registration, AuthFactory} from '../client/domain/auth';
import {LocalAuth, LocalAuthFactory, NewAuth} from '../client/localDomain/auth';
import {LocalEmployee} from '../client/localDomain/employee';
import {LocalCompany} from '../client/localDomain/company';
import {CompanyRef} from '../client/domain/company';

import {Language, LanguageFactory} from '../client/utils/lang';
import {JSONFactory} from '../client/utils/factory';
import {ComptoirRequest,ComptoirResponse} from '../client/utils/request';

import {AuthClient} from '../client/auth';

import {ErrorService} from './error';

import {MD5} from '../components/utils/md5';

export enum LoginRequiredReason {
    NO_SESSION,
    SESSION_EXPIRED
}

export class AuthService {
    static STORAGE_AUTH_KEY = "Auth";

    client:AuthClient;
    errorService:ErrorService;

    authToken:string;
    auth:LocalAuth;
    registrationRequest:ComptoirRequest;

    loginRequired:boolean;
    loginRequiredReason:LoginRequiredReason;

    loadingPromise: Promise<any>;

    constructor(@Inject(ErrorService) errorService:ErrorService) {
        this.errorService = errorService;
        this.client = new AuthClient();

        this.loadFromStorage();
    }

    login(login:string, hashedPassword:string):Promise<LocalEmployee> {
        return this.client.login(login, hashedPassword)
            .then((response:Auth) => {
                return LocalAuthFactory.toLocalAuth(response, response.token);
            }).then((localAuth:LocalAuth)=> {
                this.saveAuth(localAuth);
                return localAuth.employee;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
                return null;
            });
    }

    // Register then log in
    register(registration:Registration):Promise<LocalEmployee> {
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
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
                return null;
            });
    }

    public getEmployeeLanguage():Language {
        if (this.auth == null) {
            return null;
        }
        var employee = this.auth.employee;
        if (employee == null) {
            return LanguageFactory.DEFAULT_LANGUAGE;
        }
        var locale = employee.locale;
        var language = LanguageFactory.fromLocale(locale);
        if (language !== undefined) {
            return language;
        }
        return LanguageFactory.DEFAULT_LANGUAGE;
    }

    public getEmployeeCompany():LocalCompany {
        if (this.auth == null) {
            return null;
        }
        var employee = this.auth.employee;
        if (employee == null) {
            return null;
        }
        return employee.company;
    }

    public getEmployeeCompanyRef():CompanyRef{
        var company = this.getEmployeeCompany();
        if (company == null) {
            return null;
        }
        return new CompanyRef(company.id);
    }


    private saveAuth(auth:LocalAuth) {
        this.auth = auth;
        if (auth != null) {
            this.authToken = auth.token;
            var wsAuth = LocalAuthFactory.fromLocalAuth(auth);
            var jsonString = JSON.stringify(wsAuth, JSONFactory.toJSONReplacer);
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
            this.saveAuth(null);
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

        this.loadingPromise = LocalAuthFactory.toLocalAuth(auth, auth.token)
            .then((localAuth:LocalAuth)=> {
                this.auth = localAuth;
                this.loadingPromise = null;
                return this.checkRefreshToken();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    isExpireDateValid(date:Date) {
        // Handle null case
        if (date === undefined) {
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

    checkRefreshToken() : Promise<any>{
        if (this.loadingPromise != null) {
            return this.loadingPromise;
        }
        if (this.auth == null) {
            return Promise.resolve();
        }
        var expireDate = this.auth.expirationDateTime;
        if (!this.isExpireDateGettingClose(expireDate)) {
            return Promise.resolve();
        }
        var refreshToken = this.auth.refreshToken;
        return this.client.refreshToken(refreshToken)
            .then((auth)=> {
                return LocalAuthFactory.toLocalAuth(auth, auth.token)
            }).then((localAuth:LocalAuth)=> {
                this.saveAuth(localAuth);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    checkLoggedIn():Promise<boolean> {
        if (this.loadingPromise != null) {
            return this.loadingPromise.then(()=>{
                return this.checkLoggedIn();
            });
        }
        if (this.auth == null) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRequiredReason.NO_SESSION;
            return Promise.resolve(false);
        }
        var expireDate = this.auth.expirationDateTime;
        if (!this.isExpireDateValid(expireDate)) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRequiredReason.SESSION_EXPIRED;
            return Promise.resolve(false);
        }

        this.loginRequired = false;
        this.loginRequiredReason = null;

        this.checkRefreshToken();
        return Promise.resolve(true);
    }

}
