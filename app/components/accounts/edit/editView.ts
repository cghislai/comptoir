/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {Account, AccountType} from 'client/domain/account';
import {LocaleText} from 'client/domain/lang';

import {Language, LocaleTexts} from 'client/utils/lang';
import {NamedAccountType} from 'client/utils/account';

import {AuthService} from 'services/auth';
import {AccountService} from 'services/account';
import {ApplicationService} from 'services/application';

import {LangSelect, LocalizedDirective} from 'components/utils/langSelect/langSelect';


class AccountFormModel {
    language:Language;
    accountingNumber:string;
    iban:string;
    bic:string;
    name:string;
    description:LocaleTexts;
    accountType:AccountType;

    account:Account;

    constructor();
    constructor(account:Account, lang:Language);
    constructor(account?:Account, lang?:Language) {
        if (account == undefined) {
            this.account = new Account();
            this.description = new LocaleTexts();
            return;
        }
        this.language = lang;
        this.account = account;
        this.accountingNumber = account.accountingNumber;
        this.iban = account.iban;
        this.bic = account.bic;
        this.name = account.name;
        this.description = account.description;
        this.accountType = AccountType[account.accountType];
    }
}


@Component({
    selector: 'editAccount'
})
@View({
    templateUrl: './components/accounts/edit/editView.html',
    styleUrls: ['./components/accounts/edit/editView.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, RouterLink, LangSelect, LocalizedDirective]
})
export class EditAccountView {
    accountId:number;
    accountService:AccountService;
    appService:ApplicationService;
    authService:AuthService;
    router:Router;

    language:Language;
    accountModel:AccountFormModel;
    allAccountTypes:any[];

    constructor(accountService:AccountService, authService:AuthService, appService:ApplicationService,
                routeParams:RouteParams, router:Router) {
        var itemIdParam = routeParams.get('id');
        this.accountId = parseInt(itemIdParam);
        if (isNaN(this.accountId)) {
            this.accountId = null;
        }
        this.router = router;
        this.accountService = accountService;
        this.authService = authService;
        this.appService = appService;
        this.language = appService.language;

        this.allAccountTypes = NamedAccountType.ALL_TYPES;
        this.buildFormModel();
    }

    buildFormModel() {
        var lastEditLanguage = this.appService.laseUsedEditLanguage;
        if (this.accountId == null) {
            this.accountModel = new AccountFormModel();
            this.accountModel.language = lastEditLanguage;
            return;
        }
        var thisView = this;
        this.accountService.getAccount(this.accountId)
            .then(function (account:Account) {
                thisView.accountModel = new AccountFormModel(account, lastEditLanguage);
            }).catch((error)=> {
                this.appService.handleRequestError(error);
            });
    }


    doSaveEdit() {
        var account = this.accountModel.account;
        account.accountType = AccountType[this.accountModel.accountType];
        account.accountingNumber = this.accountModel.accountingNumber;
        account.bic = this.accountModel.bic;
        account.companyRef = this.authService.loggedEmployee.companyRef;
        account.description = this.accountModel.description;
        account.iban = this.accountModel.iban;
        account.name = this.accountModel.name;
        this.accountService.saveAccount(account)
            .then((accountRef)=> {
                this.router.navigate('/accounts/list');
            }).catch((error)=> {
                this.appService.handleRequestError(error);
            });

    }

}
