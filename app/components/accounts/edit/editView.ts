/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf, formDirectives} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {Language, LocaleTexts} from 'client/utils/lang';
import {LocaleText} from 'client/domain/lang';
import {Account, AccountType} from 'client/domain/account';
import {NamedAccountType} from 'client/utils/account';
import {AccountService} from 'services/account';
import {ApplicationService} from 'services/application';
import {AuthService} from 'services/auth';


class AccountFormModel {
    language:string;
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
        this.language = lang.locale;
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
    directives: [NgFor, NgIf, formDirectives, RouterLink]
})
export class EditAccountView {
    accountId:number;
    accountService:AccountService;
    applicationService:ApplicationService;
    authService:AuthService;
    router:Router;

    language:Language;
    allLanguages:Language[] = Language.ALL_LANGUAGES;
    lastUsedLang:Language;
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
        this.applicationService = appService;
        this.language = appService.language;
        this.lastUsedLang = appService.language;

        this.allAccountTypes = NamedAccountType.ALL_TYPES;
        this.buildFormModel();
    }

    buildFormModel() {
        if (this.accountId == null) {
            this.accountModel = new AccountFormModel();
            this.accountModel.language = this.language.locale;
            return;
        }
        var thisView = this;
        this.accountService.getAccount(this.accountId)
            .then(function (account:Account) {
                thisView.accountModel = new AccountFormModel(account, thisView.lastUsedLang);
            });
    }

    onLanguageSelected(lang:Language) {
        this.lastUsedLang = lang;
        this.accountModel.language = lang.locale;
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
        // TODO
        this.accountService.saveAccount(account)
            .then((accountRef)=> {
                this.router.navigate('/accounts/list');
            });

    }

}
