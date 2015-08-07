/**
 * Created by cghislai on 07/08/15.
 */

import {EmployeeRef} from 'client/domain/employee';
import {EmployeeLoginRequest,EmployeeLoginResponse, AuthToken} from 'client/domain/auth';
import {AuthClient} from 'client/auth';


export class AuthService {
    client:AuthClient;
    loggedEmployee:EmployeeRef;
    authToken:AuthToken;

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

    isLoggedIn():boolean {
        if (this.authToken == null) {
            return false;
        }
        var expireDate = this.authToken.validity;
        var nowDate = new Date();
        if (nowDate.getTime() <= expireDate.getTime()) {
            return false;
        }
        return true;
    }
}