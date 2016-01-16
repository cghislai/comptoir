/**
 * Created by cghislai on 07/01/16.
 */
import {provide} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, ROUTER_PRIMARY_COMPONENT,
    LocationStrategy, HashLocationStrategy} from 'angular2/router';

import {App} from './components/app/app';

import {ComptoirRequest} from './client/utils/request';
import {ServiceConfig, SERVICE_CONFIG_URL, COMPTOIR_SERVICE_URL} from './config/service';

import {CLIENT_PROVIDERS} from './client/ClientProviders';

(function () {
    var configRequest = new ComptoirRequest();
    configRequest.get(SERVICE_CONFIG_URL)
        .then((response)=> {
            var servicesConfig:ServiceConfig = JSON.parse(response.text);
            var servicesUrl = servicesConfig.comptoirWsUrl;

            bootstrap(App, [
                HTTP_PROVIDERS,
                ROUTER_PROVIDERS,
                provide(COMPTOIR_SERVICE_URL, {useValue: servicesUrl}),
                provide(ROUTER_PRIMARY_COMPONENT, {useValue: App}),
                provide(LocationStrategy, {useClass: HashLocationStrategy}),

                CLIENT_PROVIDERS
            ]);
        }, (error)=> {
            alert('Failed to read config at ' + SERVICE_CONFIG_URL);
            console.error(error);
        });
})();
