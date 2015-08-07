/**
 * Created by cghislai on 06/08/15.
 */
import {Component, View, NgFor, formDirectives} from 'angular2/angular2';
import {Router} from 'angular2/router';


import {LocaleText} from 'client/domain/lang';
import {Account, AccountType, AccountSearch} from 'client/domain/account';
import {SearchResult} from 'client/utils/searchResult';

import {AccountService, NamedAccountType} from 'services/account';
import {ApplicationService} from 'services/application';
import {AuthService} from 'services/auth';
import {Pagination, Locale} from 'services/utils';

import {Paginator} from 'components/utils/paginator/paginator';
import {AutoFocusDirective} from 'directives/autoFocus'
import {FocusableDirective} from 'directives/focusable'

@Component({
    selector: "accountsList"
})

@View({
    templateUrl: './components/accounts/list/listView.html',
    styleUrls: ['./components/accounts/list/listView.css'],
    directives: [NgFor, Paginator, formDirectives]
})

export class AccountsListView {
    accountService:AccountService;
    applicationService:ApplicationService;
    appLocale:Locale;
    router:Router;

    accountSearch:AccountSearch;
    accounts:Account[];
    accountsCount:number;
    accountsPerPage:number = 25;

    loading:boolean;

    // Delay filter input keyevent for 200ms
    //keyboardTimeoutSet: boolean;
    //keyboardTimeout: number = 200;

    constructor(accountService:AccountService, appService:ApplicationService,
                authService:AuthService, router:Router) {
        this.accountService = accountService;
        this.applicationService = appService;
        this.router = router;
        this.appLocale = appService.locale;
        this.accountSearch = new AccountSearch();
        this.accountSearch.companyRef = authService.companyRef;
        this.accountSearch.pagination = new Pagination(0, this.accountsPerPage);
        this.searchAccounts();
    }

    searchAccounts() {
        // TODO: cancel existing promises;
        if (this.loading) {
            console.log('Already loading');
            return;
        }
        this.loading = true;
        var thisView = this;
        this.accountService
            .searchAccounts(this.accountSearch)
            .then(function (result:SearchResult<Account>) {
                thisView.accountsCount = result.count;
                thisView.accounts = result.list;
                thisView.loading = false;
            }, function (error) {
                console.log("Failed to load accounts : " + error);
                thisView.loading = false;
            });
    }

    getAccountTypeLabel(accountType: AccountType): any {
        return NamedAccountType.getNamedForType(accountType).label;
    }

    onPageChanged(pagination:Pagination) {
        this.accountSearch.pagination = pagination;
        this.searchAccounts();
    }

    doEditAccount(account:Account) {
        var id = account.id;
        var url = '/accounts/edit/' + id;
        this.router.navigate(url);
    }

    doRemoveAccount(account:Account) {
        var thisView = this;
        this.accountService
            .removeAccount(account)
            .then(function (result) {
                thisView.searchAccounts();
            }, function (error) {
                console.log("Failed to remove account : " + error);
            });
    }


}