/**
 * Created by cghislai on 07/08/15.
 */

import {EmployeeRef} from 'client/domain/employee';
import {EmployeeLoginRequest,EmployeeLoginResponse, AuthToken} from 'client/domain/auth';
import {AuthClient} from 'client/auth';

export enum LoginRquiredReason {
    NO_SESSION,
    SESSION_EXPIRED
}

export class AuthService {
    client:AuthClient;
    loggedEmployee:EmployeeRef;
    authToken:AuthToken;
    loginRequired: boolean;
    loginRequiredReason: LoginRquiredReason;

    constructor() {
        this.client = new AuthClient();
        this.authToken = null;
    }

    login(login:string, password:string):Promise<EmployeeLoginResponse> {
        var loginRequest = new EmployeeLoginRequest();
        loginRequest.login = login;
        loginRequest.password = password;
        var thisService = this;
        return this.client
            .login(loginRequest)
            .then(function (loginResponse:EmployeeLoginResponse) {
                if (!loginResponse.sucess) {
                    return loginResponse;
                }
                thisService.loggedEmployee = loginResponse.employeeRef;
                thisService.authToken = loginResponse.authToken;
                return loginResponse;
            });
    }

    checkLoginRequired() {
        if (this.authToken == null) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRquiredReason.NO_SESSION;
            return true;
        }
        var expireDate = this.authToken.validity;
        var nowDate = new Date();
        if (nowDate.getTime() <= expireDate.getTime()) {
            this.loginRequired = true;
            this.loginRequiredReason = LoginRquiredReason.SESSION_EXPIRED;
            return true;
        }
        return false;
    }

}