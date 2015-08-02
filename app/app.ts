/// <reference path="typings/_custom.d.ts" />
import {Component, View,  bootstrap, ViewEncapsulation,
    ViewQuery, QueryList} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables} from 'angular2/router';
// TODO: once the d.ts is fixed, use shadow dom
// import ViewEncapsulation


import {ApplicationService} from 'services/applicationService';
import {ItemService} from 'services/itemService';
import {PictureService} from 'services/pictureService';
import {NavMenu} from './components/navMenu/navMenu';
import {SellView} from 'components/sell/sellView';
import {EditView} from 'components/edit/editView';

@Component({
    selector: 'app',
    viewInjector: [ItemService, ApplicationService, PictureService]
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
export class App {
    navMenuQuery: QueryList<NavMenu>;

    constructor(public appService:ApplicationService, public itemService: ItemService,
        @ViewQuery(NavMenu, {descendants: true}) navMenuQuery: QueryList<NavMenu>) {
        this.appService = appService;
        appService.appName = "Comptoir";
        appService.appVersion = "0.1";
        appService.pageName = "Comptoir";
        this.navMenuQuery = navMenuQuery;
    }

    getNavMenu(): NavMenu {
        return this.navMenuQuery.first;
    }
}


bootstrap(App, [routerInjectables]);
