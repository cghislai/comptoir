/// <reference path="./typings/_custom.d.ts" />
import {Component, View,  bootstrap, NgIf} from 'angular2/angular2';
import {RouteConfig, Router, RouterOutlet, RouterLink, routerInjectables, Location} from 'angular2/router';

import {AccountService} from 'services/account';
import {ApplicationService} from 'services/application';
import {AuthService} from 'services/auth';
import {BalanceService} from 'services/balance';
import {CompanyService} from 'services/company';
import {EmployeeService} from 'services/employee';
import {ErrorService} from 'services/error';
import {FileUploadService} from "services/fileUpload";
import {ItemService} from 'services/item';
import {ItemSaleService} from 'services/itemSale';
import {ItemVariantService} from 'services/itemVariant';
import {PosService} from 'services/pos';
import {SaleService} from 'services/sale';

import {DialogView} from 'components/utils/dialog/dialog';

import {LoginView} from 'routes/login/loginView';
import {RegisterView} from 'routes/register/register';

import {SalesView} from 'routes/sales/salesView';
import {ItemsView} from 'routes/items/itemsView';
import {AccountsView} from 'routes/accounts/accountsView';
import {CashView} from 'routes/cash/cashView';
import {PosView} from 'routes/pos/posView';

import {ApplicationSettingsView} from 'components/settings/application/appSettings';


@Component({
    selector: 'app'
})
@View({
    templateUrl: './app.html?v=<%= VERSION %>',
    styleUrls: ['./app.css'],
    directives: [RouterOutlet, NgIf, DialogView]
})

@RouteConfig([
    {path: '/', redirectTo:'/sales/sale/new'},
    {path: '/login', component: LoginView, as:'login'},
    {path: '/register', component: RegisterView, as:'register'},

    {path: '/sales/...', component: SalesView, as:'sales'},
    {path: '/items/...', component: ItemsView, as:'items'},
    {path: '/accounts/...', component: AccountsView, as:'accounts'},
    {path: '/cash/...', component: CashView, as:'cash'},
    {path: '/pos/...', component: PosView, as:'pos'}
])
export class App {
    appService:ApplicationService;
    authService: AuthService;
    errorService: ErrorService;

    loginRequired: boolean;
    loggedIn: boolean;
    router: Router;

    constructor(appService:ApplicationService,authService: AuthService,
                errorService: ErrorService,
                router: Router, location: Location) {
        this.appService = appService;
        this.appService.appName = "Comptoir";
        this.appService.appVersion = "0.1";
        this.authService = authService;
        this.errorService = errorService;
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


}


bootstrap(App, [
    routerInjectables,

    AuthService,

    AccountService,
    ApplicationService,
    BalanceService,
    CompanyService,
    EmployeeService,
    ErrorService,
    FileUploadService,
    ItemService,
    ItemSaleService,
    ItemVariantService,
    PosService,
    SaleService
]);
