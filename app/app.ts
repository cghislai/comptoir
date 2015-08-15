/// <reference path="typings/_custom.d.ts" />
import {Component, View,  bootstrap, NgIf} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables, Location} from 'angular2/router';

import {ApplicationService} from 'services/application';
import {AuthService} from 'services/auth';
import {ItemService} from 'services/itemService';
import {PictureService} from 'services/pictureService';
import {CashService} from 'services/cashService';
import {SaleService} from 'services/sale';
import {ItemSaleService} from 'services/itemSale';
import {CompanyService} from 'services/company';
import {AccountService} from 'services/account';
import {EmployeeService} from 'services/employee';
import {PosService} from 'services/pos';
import {FileUploadService} from "services/fileUpload";

import {RequiresLogin} from 'directives/requiresLogin';
import {NavMenu} from './components/navMenu/navMenu';
import {DialogView} from 'components/utils/dialog/dialog';


import {LoginView} from 'components/auth/login/login';
import {RegisterView} from 'components/auth/register/register';

import {SellView} from 'components/sales/sale/sellView';
import {ActiveSalesView} from 'components/sales/actives/listView';
import {SaleHistoryView} from 'components/sales/history/historyView';

import {ProductsListView} from 'components/items/list/listView';
import {EditProductView} from 'components/items/edit/editView';
import {ImportProductView} from 'components/items/import/importView';

import {CountCashView} from 'components/cash/count/countView';
import {CashHistoryView} from 'components/cash/history/historyView';

import {AccountsListView} from 'components/accounts/list/listView';
import {EditAccountView} from 'components/accounts/edit/editView';

import {PosListView} from 'components/pos/list/listView';
import {EditPosView} from 'components/pos/edit/editView';

import {ApplicationSettingsView} from 'components/settings/application/appSettings';

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
    {path: '/register', component: RegisterView, as:'register'},

    {path: '/sales/sale', component: SellView, as: 'saleCurrent'},
    {path: '/sales/sale/:id', component: SellView, as: 'salesSale'},
    {path: '/sales/actives', component: ActiveSalesView, as: 'salesActives'},
    {path: '/sales/history', component: SaleHistoryView, as: 'salesHistory'},

    {path: '/items/list', component: ProductsListView, as: 'itemsList'},
    {path: '/items/edit', component: EditProductView, as: 'itemsEditNew'},
    {path: '/items/edit/:id', component: EditProductView, as: 'itemsEdit'},
    {path: '/items/import', component: ImportProductView, as: 'itemsImport'},

    {path: '/accounts/list', component: AccountsListView, as: 'accountsList'},
    {path: '/accounts/edit', component: EditAccountView, as: 'accountsEditNew'},
    {path: '/accounts/edit/:id', component: EditAccountView, as: 'accountsEdit'},

    {path: '/pos/list', component: PosListView, as: 'posList'},
    {path: '/pos/edit', component: EditPosView, as: 'posEditNew'},
    {path: '/pos/edit/:id', component: EditPosView, as: 'posEdit'},

    {path: '/cash/count', component: CountCashView, as: 'cashCount'},
    {path: '/cash/history', component: CashHistoryView, as: 'cashHistory'},

    {path: '/settings/app', component: ApplicationSettingsView, as: 'settingsApp'}

])
export class App {
    appService:ApplicationService;
    loginRequired: boolean;

    constructor(appService:ApplicationService) {
        this.appService = appService;
        this.appService.appName = "Comptoir";
        this.appService.appVersion = "0.1";
    }



    onErrorClose() {
        this.appService.dismissError();
    }

    onLoginRequired(required: boolean) {
        this.loginRequired = required;
        console.log('required:'+required);
    }

}


bootstrap(App, [
    routerInjectables,

    ApplicationService,
    AuthService,

    AccountService,
    CashService,
    CompanyService,
    EmployeeService,
    FileUploadService,
    ItemService,
    ItemSaleService,
    PictureService,
    PosService,
    SaleService,
    NavMenu
]);
