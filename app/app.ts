/// <reference path="typings/_custom.d.ts" />
import {Component, View,  bootstrap, ViewEncapsulation} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables} from 'angular2/router';
// TODO: once the d.ts is fixed, use shadow dom
// import ViewEncapsulation


import {ApplicationService} from './services/applicationService';
import {NavMenu} from './components/navMenu/navMenu';
import {SellView} from 'components/sell/sellView';
import {EditView} from 'components/edit/editView';

@Component({
    selector: 'app',
    viewInjector: [ApplicationService]
})
@RouteConfig([
    { path: '/', redirectTo: '/sell'},
    { path: '/sell', component: SellView, as: 'sell' },
    { path: '/edit/...', component: EditView, as: 'edit' }

])
@View({
    templateUrl: './app.html?v=<%= VERSION %>',
    styleUrls: ['./app.css'],
    directives: [RouterOutlet, RouterLink, NavMenu],
    encapsulation: ViewEncapsulation.EMULATED
})
class App {
    appService:ApplicationService;

    constructor(appService:ApplicationService) {
        this.appService = appService;
        appService.appName = "Comptoir";
        appService.appVersion = "0.1";
        appService.pageName = "Comptoir";
    }
}


bootstrap(App, [routerInjectables]);
