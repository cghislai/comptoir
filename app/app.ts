/// <reference path="typings/_custom.d.ts" />
import {Component, View,  bootstrap} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables, Location} from 'angular2/router';

import {ApplicationService} from 'services/application';
import {ItemService} from 'services/itemService';
import {PictureService} from 'services/pictureService';
import {CashService} from 'services/cashService';
import {CommandService} from 'services/commandService';
import {CompanyService} from 'services/company';
import {AccountService} from 'services/account';
import {NavMenu} from './components/navMenu/navMenu';


import {SellView} from 'components/sale/current/sellView';
import {HistoryView as SellHistoryView} from 'components/sale/history/historyView';

import {ProductsListView} from 'components/products/list/listView';
import {EditProductView} from 'components/products/edit/editView';

import {CountCashView} from 'components/cash/count/countView';
import {CashHistoryView} from 'components/cash/history/historyView';

import {AccountsListView} from 'components/accounts/list/listView';
import {EditAccountView} from 'components/accounts/edit/editView';

import {ApplicationSettingsView} from 'components/settings/application/appSettings'

import {Parent} from 'components/test/test';

@Component({
    selector: 'app'
})
@View({
    templateUrl: './app.html?v=<%= VERSION %>',
    styleUrls: ['./app.css'],
    directives: [RouterOutlet, RouterLink, NavMenu]
})

@RouteConfig([
    {path: '/', redirectTo:'/sale/current'},
    {path: '/sale/current', component: SellView, as: 'saleCurrent'},
    {path: '/sale/history', component: SellHistoryView, as: 'saleHistory'},

    {path: '/products/list', component: ProductsListView, as: 'productsList'},
    {path: '/products/edit', component: EditProductView, as: 'productsEditNew'},
    {path: '/products/edit/:id', component: EditProductView, as: 'productsEdit'},

    {path: '/accounts/list', component: AccountsListView, as: 'accountsList'},
    {path: '/accounts/edit', component: EditAccountView, as: 'accountsEditNew'},
    {path: '/accounts/edit/:id', component: EditAccountView, as: 'accountsEdit'},

    {path: '/cash/count', component: CountCashView, as: 'cashCount'},
    {path: '/cash/history', component: CashHistoryView, as: 'cashHistory'},

    {path: '/settings/app', component: ApplicationSettingsView, as: 'settingsApp'}

])
export class App {
    appService:ApplicationService;
    location:Location;

    constructor(appService:ApplicationService,
                location: Location,
                companyService: CompanyService) {
        this.appService = appService;
        this.appService.appName = "Comptoir";
        this.appService.appVersion = "0.1";
        this.location = location;
    }


}


bootstrap(App, [routerInjectables,
    ApplicationService, ItemService, CashService, PictureService, CommandService,
    CompanyService, AccountService, NavMenu
]);
