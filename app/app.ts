/// <reference path="typings/_custom.d.ts" />
import {Component, View,  bootstrap, ViewEncapsulation,
    ViewQuery, QueryList, Inject} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables} from 'angular2/router';

import {ApplicationService} from 'services/applicationService';
import {ItemService} from 'services/itemService';
import {PictureService} from 'services/pictureService';
import {CashService} from 'services/cashService';
import {CommandService} from 'services/commandService';
import {NavMenu} from './components/navMenu/navMenu';
import {SellView} from 'components/sell/sellView';
import {EditView} from 'components/edit/editView';
import {HistoryView} from 'components/history/historyView';

@Component({
    selector: 'app'
})
@RouteConfig([
    { path: '/', redirectTo: '/sell'},
    { path: '/sell', component: SellView, as: 'sell' },
    { path: '/edit/...', component: EditView, as: 'edit' },
    { path: '/history/...', component: HistoryView, as: 'history' }

])
@View({
    templateUrl: './app.html?v=<%= VERSION %>',
    styleUrls: ['./app.css'],
    directives: [RouterOutlet, RouterLink, NavMenu]
})
export class App {
    navMenuQuery: QueryList<NavMenu>;
    appService: ApplicationService;

    constructor(
        appService: ApplicationService) {
        this.appService = appService;
        this.appService.appName = "Comptoir";
        this.appService.appVersion = "0.1";
        this.appService.pageName = "Comptoir";
        //this.navMenuQuery = navMenuQuery;
    }

    getNavMenu(): NavMenu {
        return this.navMenuQuery.first;
    }
}


bootstrap(App, [routerInjectables,
    ApplicationService, ItemService, CashService, PictureService, CommandService, NavMenu
]);
