/// <reference path="typings/_custom.d.ts" />
import {Component, View,  bootstrap} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables} from 'angular2/router';
// TODO: once the d.ts is fixed, use shadow dom
// import ViewEncapsulation


import {NamesList} from './services/NameList';
import {ApplicationService} from './services/applicationService';
import {Home} from './components/home/home';
import {About} from './components/about/about';
import {NavMenu} from './components/navMenu/navMenu';
import {SellView} from './components/sellView/sellView';

@Component({
    selector: 'app',
    viewInjector: [NamesList, ApplicationService]
})
@RouteConfig([
    {path: '/home', component: Home, as: 'home'},
    {path: '/about', component: About, as: 'about'},
    { path: '/', component: SellView, as: 'sell' },
    { path: '/sell', component: SellView, as: 'sell' }
])
@View({
    templateUrl: './app.html?v=<%= VERSION %>',
    styleUrls: ['./app.css'],
    directives: [RouterOutlet, RouterLink, NavMenu]
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
