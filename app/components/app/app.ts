/// <reference path="./../../typings/_custom.d.ts" />
import {Component, View,  bootstrap, NgIf} from 'angular2/angular2';
import {RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_BINDINGS, Location} from 'angular2/router';

import {AccountService} from '../../services/account';
import {AccountingEntryService} from '../../services/accountingEntry';
import {ApplicationService} from '../../services/application';
import {AttributeDefinitionService} from '../../services/attributeDefinition';
import {AttributeValueService} from '../../services/attributeValue';
import {AuthService} from '../../services/auth';
import {BalanceService} from '../../services/balance';
import {CompanyService} from '../../services/company';
import {EmployeeService} from '../../services/employee';
import {ErrorService} from '../../services/error';
import {FileUploadService} from '../../services/fileUpload';
import {ItemService} from '../../services/item';
import {ItemVariantService} from '../../services/itemVariant';
import {ItemVariantSaleService} from '../../services/itemVariantSale';
import {MoneyPileService} from '../../services/moneyPile';
import {PictureService} from '../../services/picture';
import {PosService} from '../../services/pos';
import {SaleService} from '../../services/sale';

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
    viewBindings: [
        AuthService,

        AccountService,
        AccountingEntryService,
        ApplicationService,
        AttributeDefinitionService,
        AttributeValueService,
        BalanceService,
        CompanyService,
        EmployeeService,
        ErrorService,
        FileUploadService,
        ItemService,
        ItemVariantService,
        ItemVariantSaleService,
        MoneyPileService,
        PictureService,
        PosService,
        SaleService
    ]
})
@View({
    templateUrl: './components/app/app.html',
    styleUrls: ['./components/app/app.css'],
    directives: [ROUTER_DIRECTIVES, NgIf, DialogView]
})

@RouteConfig([
    {path: '/', redirectTo: '/Sales/Sale/New'},
    {path: '/login', component: LoginView, as: 'Login'},
    {path: '/register', component: RegisterView, as: 'Register'},

    {path: '/sales/...', component: SalesView, as: 'Sales'},
    {path: '/items/...', component: ItemsView, as: 'Items'},
    {path: '/accounts/...', component: AccountsView, as: 'Accounts'},
    {path: '/cash/...', component: CashView, as: 'Cash'},
    {path: '/pos/...', component: PosView, as: 'Pos'}
])
export class App {
    appService:ApplicationService;
    authService:AuthService;
    errorService:ErrorService;

    loginRequired:boolean;
    loggedIn:boolean;
    router:Router;

    constructor(appService:ApplicationService, authService:AuthService,
                errorService:ErrorService,
                router:Router, location:Location) {
        this.appService = appService;
        this.appService.appName = "Comptoir";
        this.appService.appVersion = "0.1";
        this.authService = authService;
        this.errorService = errorService;
        this.router = router;
        router.subscribe((path)=> {
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
        this.authService.checkLoggedIn()
            .then((loggedIn)=> {
                this.loggedIn = loggedIn;
                if (!loggedIn) {
                    this.router.navigate(['/Login']);
                }
            });

    }


}


bootstrap(App, [
    ROUTER_BINDINGS
]);
