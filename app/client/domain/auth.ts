/**
 * Created by cghislai on 07/08/15.
 */

import {EmployeeRef, EmployeeFactory} from 'client/domain/employee'

// FIXME check api
export class EmployeeLoginRequest {
    login: string;
    password: string;
}

export class AuthToken {
    token: string;
    validity: Date;
}

// FIXME: check api
export class EmployeeLoginResponse {
    employeeRef: EmployeeRef;
    authToken: AuthToken;
    sucess: boolean;
    errorReaseon: string;
}

export class AuthFactory {
    static getAuthTokenFromJSON(jsonObject: any) : AuthToken {
        if (jsonObject == undefined) {
            return undefined;
        }
        var token = new AuthToken();
        token.token = jsonObject.token;
        var dateTime = Date.parse(jsonObject.validity);
        token.validity = new Date(dateTime);
        return token;
    }
    static getLoginResponsefromJSON(jsonObject: any) :EmployeeLoginResponse {
        if (jsonObject == undefined) {
            return undefined;
        }
        var response = new EmployeeLoginResponse();
        response.authToken = AuthFactory.getAuthTokenFromJSON(jsonObject.authToken);
        response.employeeRef = EmployeeFactory.getEmployeeRefFromJSON(jsonObject.employeeRef);
        return response;
    }
}