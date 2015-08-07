/**
 * Created by cghislai on 07/08/15.
 */

import {PromiseRequest} from 'client/utils/request';
import {EmployeeLoginRequest, EmployeeLoginResponse, AuthFactory} from 'client/domain/auth';

export class AuthClient {
    private static serviceUrl:string = "http://somewhere.com/";
    private static loginUrl:string = AuthClient.serviceUrl + "/login";

    login(loginRequest:EmployeeLoginRequest):Promise<EmployeeLoginResponse> {
        var loginRequestJSON = JSON.stringify(loginRequest);
        var request = new PromiseRequest();
        return request
            .post(loginRequestJSON, AuthClient.loginUrl)
            .then(function (response) {
                var loginResponse = AuthFactory.getLoginResponsefromJSON(response);
                return loginResponse;
            });
    }
}