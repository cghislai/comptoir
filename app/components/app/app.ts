/// <reference path="./../../typings/_custom.d.ts" />
import {Component} from 'angular2/core';
import {NgIf} from 'angular2/common';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {SERVICES_PROVIDERS} from '../../services/ServicesProviders';
import {AuthService} from '../../services/auth';
import {ApplicationService} from '../../services/application';
import {ErrorService} from '../../services/error';

import {DialogView} from '../../components/utils/dialog/dialog';

import {LoginView} from '../../routes/login/loginView';
import {RegisterView} from '../../routes/register/register';
import {SalesView} from '../../routes/sales/salesView';
import {ItemsView} from '../../routes/items/itemsView';
import {AccountsView} from '../../routes/accounts/accountsView';
import {CashView} from '../../routes/cash/cashView';
import {PosView} from '../../routes/pos/posView';


@Component({
    selector: 'app',
    templateUrl: './components/app/app.html',
    styleUrls: ['./components/app/app.css'],
    directives: [ROUTER_DIRECTIVES, NgIf, DialogView],
    viewProviders: [
        SERVICES_PROVIDERS
    ]
})
@RouteConfig([
    {path: '/login', component: LoginView, name: 'Login', useAsDefault: true},
    {path: '/register', component: RegisterView, name: 'Register'},

    {path: '/sales/...', component: SalesView, name: 'Sales'},
    {path: '/items/...', component: ItemsView, name: 'Items'},
    {path: '/accounts/...', component: AccountsView, name: 'Accounts'},
    {path: '/cash/...', component: CashView, name: 'Cash'},
    {path: '/pos/...', component: PosView, name: 'Pos'}
])
export class App {
    appService:ApplicationService;
    authService:AuthService;
    errorService:ErrorService;
    loginRequired:boolean;

    router:Router;

    constructor(appService:ApplicationService, authService:AuthService,
                errorService:ErrorService,
                router:Router) {
        this.appService = appService;
        this.appService.appName = "Comptoir";
        this.appService.appVersion = "0.1";
        this.authService = authService;
        this.errorService = errorService;
        this.router = router;
        router.subscribe(()=> {
            this.checkLoginRequired();
        });
        this.checkLoginRequired();
    }


    private checkLoginRequired() {
        var loginInstruction = this.router.generate(['/Login']);
        var registerInstruction = this.router.generate(['/Register']);
        if (!this.router.isRouteActive(loginInstruction) && !this.router.isRouteActive(registerInstruction)) {
            this.authService.checkLoggedIn()
                .then((loggedIn)=> {
                    this.loginRequired = !loggedIn;
                    if (!loggedIn) {
                        this.router.navigate(['/Login']);
                    }
                });
        } else {
            this.loginRequired = false;
        }
    }
}

