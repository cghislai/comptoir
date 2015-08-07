/// <reference path="typings/_custom.d.ts" />
import {Component, View,  bootstrap, NgIf} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables, Location} from 'angular2/router';

import {ApplicationService} from 'services/application';
import {AuthService} from 'services/auth';
import {ItemService} from 'services/itemService';
import {PictureService} from 'services/pictureService';
import {CashService} from 'services/cashService';
import {CommandService} from 'services/commandService';
import {CompanyService} from 'services/company';
import {AccountService} from 'services/account';

import {RequiresLogin} from 'directives/requiresLogin';
import {NavMenu} from './components/navMenu/navMenu';
import {DialogView} from 'components/utils/dialog/dialog';


import {LoginView} from 'components/auth/login/login';

import {SellView} from 'components/sales/sale/sellView';
import {ActiveSalesListView} from 'components/sales/actives/listView';
import {HistoryView as SellHistoryView} from 'components/sales/history/historyView';

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
    directives: [RouterOutlet, RouterLink, NavMenu, RequiresLogin, DialogView, NgIf]
})

@RouteConfig([
    {path: '/', redirectTo:'/login'},
    {path: '/login', component: LoginView, as:'login'},

    {path: '/sales/sale', component: SellView, as: 'saleCurrent'},
    {path: '/sales/sale/:id', component: SellView, as: 'salesSale'},
    {path: '/sales/actives', component: ActiveSalesListView, as: 'salesActives'},
    {path: '/sales/history', component: SellHistoryView, as: 'salesHistory'},

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

    constructor(appService:ApplicationService) {
        this.appService = appService;
        this.appService.appName = "Comptoir";
        this.appService.appVersion = "0.1";
    }



    onErrorClose() {
        this.appService.dismissError();
    }


}


bootstrap(App, [routerInjectables,
    ApplicationService, ItemService, CashService, PictureService, CommandService,
    CompanyService, AccountService, AuthService, NavMenu
]);
