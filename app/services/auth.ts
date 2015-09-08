/**
 * Created by cghislai on 07/08/15.
 */
import {Inject} from 'angular2/angular2';

import {Auth, Registration, AuthFactory} from 'client/domain/auth';
import {LocalAuth, LocalAuthFactory} from 'client/localDomain/auth';
import {LocalEmployee} from 'client/localDomain/employee';

import {Language} from 'client/utils/lang';
import {JSONFactory} from 'client/utils/factory';
import {ComptoirRequest,ComptoirResponse} from 'client/utils/request';

import {AuthClient} from 'client/auth';

import {ErrorService} from 'services/error';

import {MD5} from 'components/utils/md5';

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

    constructor(@Inject errorService:ErrorService) {
        this.errorService = errorService;
        this.client = new AuthClient();

        this.loadFromStorage();
    }

    login(login:string, hashedPassword:string):Promise<LocalEmployee> {
        return this.client.login(login, hashedPassword)
            .then((response:Auth) => {
                this.saveAuth(response);
                return LocalAuthFactory.toLocalAuth(response, response.token);
            }).then((localAuth: LocalAuth)=>{
                return localAuth.employee;
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
            return Language.DEFAULT_LANGUAGE;
        }
        var locale = employee.locale;
        var language = Language.fromLanguage(locale);
        if (language != undefined) {
            return language;
        }
        return Language.DEFAULT_LANGUAGE;
    }


    private saveAuth(auth:Auth) {
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

        LocalAuthFactory.toLocalAuth(auth, auth.token)
            .then((localAuth:LocalAuth)=> {
                this.auth = localAuth;
                this.checkRefreshToken();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
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
