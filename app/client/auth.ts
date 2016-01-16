/**
 * Created by cghislai on 07/08/15.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {Registration, Auth, AuthFactory} from './domain/auth';
import {CompanyRef} from './domain/company';
import {ComptoirRequest} from './utils/request';
import {COMPTOIR_SERVICE_URL} from '../config/service';

export class AuthClient {
    serviceConfigUrl:string;

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        this.serviceConfigUrl = serviceUrl;
    }

    private getLoginUrl():string {
        return this.serviceConfigUrl + "/auth";
    }

    private getRegisterUrl():string {
        return this.serviceConfigUrl + "/registration";
    }

    private getRefreshUrl():string {
        return this.serviceConfigUrl + "/auth/refresh";
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
                var auth:Auth = JSON.parse(response.text, AuthFactory.fromJSONReviver);
                return auth;
            });
    }

    register(registration:Registration):Promise<CompanyRef> {
        var request = new ComptoirRequest();
        return request
            .post(registration, this.getRegisterUrl(), null)
            .then((response)=> {
                var companyRef:CompanyRef = JSON.parse(response.text);
                return companyRef;
            });
    }

    getRegisterRequest(registration:Registration):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getRegisterUrl();
        request.setup('POST', url, null);
        request.setupData(registration);
        return request;
    }

    refreshToken(refreshToken:string) {
        var request = new ComptoirRequest();
        var url = this.getRefreshUrl();
        url += "/" + refreshToken;
        return request
            .post(null, url, null)
            .then((response)=> {
                var auth:Auth = JSON.parse(response.text, AuthFactory.fromJSONReviver);
                return auth;
            });
    }
}