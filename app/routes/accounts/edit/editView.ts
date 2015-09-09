/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {LocalAccount, LocalAccountFactory} from 'client/localDomain/account';

import {Account, AccountType, ALL_ACCOUNT_TYPES} from 'client/domain/account';
import {CompanyRef} from 'client/domain/company';

import {Language, LocaleTexts} from 'client/utils/lang';

import {AuthService} from 'services/auth';
import {AccountService} from 'services/account';
import {ErrorService} from 'services/error';

import {LangSelect} from 'components/lang/langSelect/langSelect';
import {LocalizedDirective} from 'components/utils/localizedInput';
import {RequiredValidator} from 'components/utils/validators';
import {FormMessage} from 'components/utils/formMessage/formMessage';

@Component({
    selector: 'editAccount'
})
@View({
    templateUrl: './routes/accounts/edit/editView.html',
    styleUrls: ['./routes/accounts/edit/editView.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, RouterLink, LangSelect, LocalizedDirective,
        RequiredValidator, FormMessage]
})
export class AccountsEditView {
    accountId:number;
    accountService:AccountService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;

    editingAccount:LocalAccount;
    editingLanguage:Language;
    appLocale:string;

    allAccountTypes = ALL_ACCOUNT_TYPES;

    constructor(accountService:AccountService, authService:AuthService, errorService:ErrorService,
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
        var language = authService.getEmployeeLanguage();
        this.editingLanguage = language;
        this.appLocale = language.locale;

        this.findAccount();
    }

    findAccount() {
        if (this.accountId == null) {
            this.editingAccount = new LocalAccount();
            return;
        }
        this.accountService.get(this.accountId)
            .then((account:LocalAccount)=> {
                this.editingAccount = account;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    getAccountTypeLabel(accountType:AccountType) {
        return LocalAccountFactory.getAccountTypeLabel(accountType);
    }

    doSaveEdit() {
        this.accountService.save(this.editingAccount)
            .then(()=> {
                this.router.navigate('/accounts/list');
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });

    }

}
