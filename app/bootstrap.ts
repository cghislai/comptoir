/**
 * Created by cghislai on 07/01/16.
 */
import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, ROUTER_PRIMARY_COMPONENT,
    LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {App} from './components/app/app';

bootstrap(App, [
    ROUTER_PROVIDERS,
    provide(ROUTER_PRIMARY_COMPONENT, {useValue: App}),
    provide(LocationStrategy, {useClass: HashLocationStrategy})
]);
