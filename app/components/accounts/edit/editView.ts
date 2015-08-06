/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf, formDirectives} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {Locale} from 'services/utils';
import {LocaleText} from 'client/domain/lang';
import {Account, AccountType} from 'client/domain/account';
import {AccountService, NamedAccountType} from 'services/account';
import {ApplicationService} from 'services/application';

class AccountFormModel {
    locale:Locale;
    accountingNumber: string;
    iban: string;
    bic: string;
    name: string;
    description: LocaleText;
    accountType: AccountType;

    account: Account;

    constructor();
    constructor(account:Account, locale:Locale);
    constructor(account?:Account, locale?:Locale) {
        if (account == undefined) {
            this.account = new Account();
            this.description = new LocaleText();
            return;
        }
        this.locale = locale;
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
    templateUrl: './components/accounts/edit/editView.html',
    styleUrls: ['./components/accounts/edit/editView.css'],
    directives: [NgFor, NgIf, formDirectives, RouterLink]
})
export class EditAccountView {
    accountId: number;
    accountService: AccountService;
    applicationService:ApplicationService;
    router: Router;

    appLocale:Locale;
    allLocales:Locale[] = Locale.ALL_LOCALES;
    accountModel:AccountFormModel;
    lastUsedLocale:Locale;
    allAccountTypes: any[];

    constructor(accountService:AccountService, appService:ApplicationService,
                routeParams:RouteParams, router: Router) {
        var itemIdParam = routeParams.get('id');
        this.accountId = parseInt(itemIdParam);
        if (isNaN(this.accountId)) {
            this.accountId = null;
        }
        this.router = router;
        this.accountService = accountService;
        this.applicationService = appService;
        this.appLocale = appService.locale;
        this.lastUsedLocale = this.appLocale;

        this.allAccountTypes = NamedAccountType.ALL_TYPES;
        this.buildFormModel();
    }

    buildFormModel() {
        if (this.accountId == null) {
            this.accountModel = new AccountFormModel();
            this.accountModel.locale = this.appLocale;
            return;
        }
        var thisView = this;
        this.accountService.getAccount(this.accountId)
            .then(function (account: Account) {
                thisView.accountModel = new AccountFormModel(account, thisView.appLocale);
            });
    }

    onLanguageSelected(locale:Locale) {
        this.lastUsedLocale = locale;
        this.accountModel.locale = locale;
        if (!this.accountModel.description.localeTextMap.hasOwnProperty(locale.isoCode)) {
            this.accountModel.description.localeTextMap[locale.isoCode] = null;
        }
    }

    doSaveEdit() {
        this.lastUsedLocale = this.accountModel.locale;

        var account = this.accountModel.account;
        account.accountType = this.accountModel.accountType;
        account.accountingNumber = this.accountModel.accountingNumber;
        account.bic = this.accountModel.bic;
        account.company = this.applicationService.companyRef;
        account.description = this.accountModel.description;
        account.iban = this.accountModel.iban;
        account.name = this.accountModel.name;
        // TODO
        this.accountService.saveAccount(account);

        this.router.navigate('/accounts/list');
    }

}
