/// <reference path="typings/_custom.d.ts" />
import {Component, View,  bootstrap, ViewEncapsulation,
    ViewQuery, QueryList, Inject} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables, Location} from 'angular2/router';

import {ApplicationService} from 'services/applicationService';
import {ItemService} from 'services/itemService';
import {PictureService} from 'services/pictureService';
import {CashService} from 'services/cashService';
import {CommandService} from 'services/commandService';
import {NavMenu} from './components/navMenu/navMenu';
import {SellView} from 'components/sale/current/sellView';
import {HistoryView as SellHistoryView} from 'components/sale/history/historyView';
import {EditView} from 'components/edit/editView';
import {HistoryView} from 'components/history/historyView';

@Component({
    selector: 'app'
})
@RouteConfig([
    {path: '/', redirectTo: '/sale'},
    {path: '/sale/current', component: SellView, as: 'saleCurrent'},
    {path: '/sale/history', component: SellHistoryView, as: 'saleHistory'},
    {path: '/edit/...', component: EditView, as: 'edit'},
    {path: '/history/...', component: HistoryView, as: 'history'}

])
@View({
    templateUrl: './app.html?v=<%= VERSION %>',
    styleUrls: ['./app.css'],
    directives: [RouterOutlet, RouterLink, NavMenu]
})
export class App {
    appService:ApplicationService;
    location:Location;

    constructor(appService:ApplicationService, location: Location) {
        this.appService = appService;
        this.appService.appName = "Comptoir";
        this.appService.appVersion = "0.1";
        this.appService.pageName = "Comptoir";
        this.location = location;
    }


    isActive(path:string) {
        return this.location.path().indexOf(path) == 0;
    }
    getPageName() {
        if (this.isActive('/sale')) {
            return "Ventes";
        }
    }
}


bootstrap(App, [routerInjectables,
    ApplicationService, ItemService, CashService, PictureService, CommandService, NavMenu
]);
