/**
 * Created by cghislai on 07/08/15.
 */

import {Registration, Auth, AuthFactory} from 'client/domain/auth';
import {CompanyRef} from 'client/domain/company';
import {ComptoirRequest} from 'client/utils/request';
import {ServiceConfig} from 'client/utils/service';

export class AuthClient {

    private getLoginUrl():string {
        return ServiceConfig.URL + "/auth";
    }

    private getRegisterUrl():string {
        return ServiceConfig.URL + "/registration";
    }

    private getRefreshUrl():string {
        return ServiceConfig.URL + "/auth/refresh";
    }

    login(login:string, password:string):Promise<Auth> {
        var request = new ComptoirRequest();
        var body = {
            'login': login,
            'passwordHash': password
        };

        return request
            .post(body, this.getLoginUrl(), null)
            .then(function (response) {
                var auth:Auth = JSON.parse(response.text, AuthFactory.fromJSONAuthReviver);
                return auth;
            });
    }

    register(registration:Registration):Promise<CompanyRef> {
        var request = new ComptoirRequest();
        return request
            .post(registration, this.getRegisterUrl(), null)
            .then((response)=> {
                var companyRef: CompanyRef = JSON.parse(response.text);
                return companyRef;
            });
    }

    refreshToken(refreshToken: string) {
        var request = new ComptoirRequest();
        var url = this.getRefreshUrl();
        url += "/"+refreshToken;
        return request
            .post(null, url, null)
            .then((response)=> {
                var auth:Auth = JSON.parse(response.text, AuthFactory.fromJSONAuthReviver);
                return auth;
            });
    }
}