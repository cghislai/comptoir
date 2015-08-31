/// <reference path="./typings/_custom.d.ts" />
import {Component, View,  bootstrap, NgIf} from 'angular2/angular2';
import {RouteConfig, Router, RouterOutlet, RouterLink, routerInjectables, Location} from 'angular2/router';

import {ApplicationService} from 'services/application';
import {AuthService} from 'services/auth';
import {ItemService} from 'services/itemService';
import {PictureService} from 'services/pictureService';
import {BalanceService} from 'services/balance';
import {SaleService} from 'services/sale';
import {ItemSaleService} from 'services/itemSale';
import {CompanyService} from 'services/company';
import {AccountService} from 'services/account';
import {EmployeeService} from 'services/employee';
import {PaymentService} from 'services/payment';
import {PosService} from 'services/pos';
import {FileUploadService} from "services/fileUpload";

import {NavMenu} from './components/navMenu/navMenu';
import {DialogView} from 'components/utils/dialog/dialog';


import {LoginView} from 'routes/login/loginView';
import {RegisterView} from 'routes/register/register';

import {SalesView} from 'routes/sales/salesView';

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


@Component({
    selector: 'app'
})
@View({
    templateUrl: './app.html?v=<%= VERSION %>',
    styleUrls: ['./app.css'],
    directives: [RouterOutlet, NgIf]
})

@RouteConfig([
    {path: '/', redirectTo:'/sales/sale/new'},
    {path: '/login', component: LoginView, as:'login'},
    {path: '/register', component: RegisterView, as:'register'},

    {path: '/sales/...', component: SalesView, as:'sales'}
])
export class App {
    appService:ApplicationService;
    authService: AuthService;

    loginRequired: boolean;
    loggedIn: boolean;
    router: Router;

    constructor(appService:ApplicationService,authService: AuthService,
                router: Router, location: Location) {
        this.appService = appService;
        this.appService.appName = "Comptoir";
        this.appService.appVersion = "0.1";
        this.authService = authService;
        this.router = router;
        router.subscribe((path)=>{
           this.checkLoginRequired(path);
        });
        this.checkLoginRequired(location.path());
    }

    checkLoginRequired(path:string) {
        if (path.indexOf('login') >= 0) {
            this.loginRequired = false;
            return;
        }
        if (path.indexOf('register') >= 0) {
            this.loginRequired = false;
            return;
        }
        this.loginRequired = true;
        // Check if logged-in
        var loggedIn:boolean = this.authService.checkLoggedIn();
        this.loggedIn = loggedIn;
        if (!loggedIn) {
            this.router.navigate('/login');
        }

    }


    onErrorClose() {
        this.appService.dismissError();
    }

}


bootstrap(App, [
    routerInjectables,

    ApplicationService,
    AuthService,

    AccountService,
    BalanceService,
    CompanyService,
    EmployeeService,
    FileUploadService,
    ItemService,
    ItemSaleService,
    PaymentService,
    PictureService,
    PosService,
    SaleService,
    NavMenu
]);
