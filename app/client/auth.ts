/**
 * Created by cghislai on 07/08/15.
 */

import {Registration, Auth, AuthFactory} from './domain/auth';
import {CompanyRef} from './domain/company';
import {ComptoirRequest} from './utils/request';
import {ServiceConfig} from '../config/service';

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

    getRegisterRequest(registration:Registration):ComptoirRequest{
        var request = new ComptoirRequest();
        var url = this.getRegisterUrl();
        request.setup('POST', url, null);
        request.setupData(registration);
        return request;
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