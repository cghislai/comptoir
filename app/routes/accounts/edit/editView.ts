/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {LocalAccount, LocalAccountFactory} from 'client/localDomain/account';

import {Account, AccountType, ALL_ACCOUNT_TYPES} from 'client/domain/account';
import {LocaleText} from 'client/domain/lang';

import {Language, LocaleTexts} from 'client/utils/lang';

import {AuthService} from 'services/auth';
import {AccountService} from 'services/account';
import {ErrorService} from 'services/error';

import {LangSelect, LocalizedDirective} from 'components/utils/langSelect/langSelect';


class AccountFormModel {
    language:Language;
    accountingNumber:string;
    iban:string;
    bic:string;
    name:string;
    description:LocaleTexts;
    accountType:AccountType;

    account:LocalAccount;

    constructor();
    constructor(account:LocalAccount, lang:Language);
    constructor(account?:LocalAccount, lang?:Language) {
        if (account == undefined) {
            this.account = new LocalAccount();
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
        this.accountType = account.accountType;
    }
}


@Component({
    selector: 'editAccount'
})
@View({
    templateUrl: './routes/accounts/edit/editView.html',
    styleUrls: ['./routes/accounts/edit/editView.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, RouterLink, LangSelect, LocalizedDirective]
})
export class AccountsEditView {
    accountId:number;
    accountService:AccountService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;

    language:Language;
    accountModel:AccountFormModel;
    allAccountTypes = ALL_ACCOUNT_TYPES;

    constructor(accountService:AccountService, authService:AuthService, errorService: ErrorService,
                routeParams:RouteParams, router:Router) {
        var itemIdParam = routeParams.get('id');
        this.accountId = parseInt(itemIdParam);
        if (isNaN(this.accountId)) {
            this.accountId = null;
        }
        this.router = router;
        this.accountService = accountService;
        this.authService = authService;
        this.errorService = errorService;
        this.language = authService.getEmployeeLanguage();

        this.buildFormModel();
    }

    buildFormModel() {
        if (this.accountId == null) {
            this.accountModel = new AccountFormModel();
            this.accountModel.language = this.language;
            return;
        }
        var thisView = this;
        this.accountService.getLocalAccountAsync(this.accountId)
            .then(function (account:LocalAccount) {
                thisView.accountModel = new AccountFormModel(account, this.language);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    getAccountTypeLabel(accountType: AccountType) {
        return LocalAccountFactory.getAccountTypeLabel(accountType);
    }

    doSaveEdit() {
        var localAccount = this.accountModel.account;
        var account = LocalAccountFactory.fromLocalAccount(localAccount);
        account.accountType = this.accountModel.accountType;
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
                this.errorService.handleRequestError(error);
            });

    }

}
