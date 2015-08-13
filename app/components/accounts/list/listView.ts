/**
 * Created by cghislai on 06/08/15.
 */
import {Component, View, NgFor, NgIf, formDirectives} from 'angular2/angular2';
import {Router} from 'angular2/router';


import {Account, AccountType, AccountSearch} from 'client/domain/account';
import {SearchResult} from 'client/utils/search';
import {LocaleTexts, Language} from 'client/utils/lang';
import {NamedAccountType} from 'client/utils/account';

import {AccountService} from 'services/account';
import {ApplicationService} from 'services/application';
import {AuthService} from 'services/auth';
import {Pagination} from 'client/utils/pagination';

import {Paginator} from 'components/utils/paginator/paginator';
import {AutoFocusDirective} from 'directives/autoFocus'
import {FocusableDirective} from 'directives/focusable'

@Component({
    selector: "accountsList"
})

@View({
    templateUrl: './components/accounts/list/listView.html',
    styleUrls: ['./components/accounts/list/listView.css'],
    directives: [NgFor, NgIf, Paginator, formDirectives]
})

export class AccountsListView {
    accountService:AccountService;
    router:Router;

    accountSearch:AccountSearch;
    pagination:Pagination;
    accountSearchResult:SearchResult<Account>;
    accountCount: number;
    accountsPerPage:number = 25;

    language:string;
    loading:boolean;

    constructor(accountService:AccountService, appService:ApplicationService,
                authService:AuthService, router:Router) {
        this.accountService = accountService;
        this.router = router;

        this.accountSearch = new AccountSearch();
        this.accountSearch.companyRef = authService.loggedEmployee.companyRef;
        this.pagination = new Pagination(0, this.accountsPerPage);

        this.language = appService.language.locale;
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
            .searchAccounts(this.accountSearch, this.pagination)
            .then(function (result:SearchResult<Account>) {
                thisView.accountSearchResult = result;
                thisView.accountCount = result.count;
                thisView.loading = false;
            }, function (error) {
                console.log("Failed to load accounts : " + error);
                thisView.loading = false;
            });
    }

    getAccountTypeLabel(accountTypeName: string): any {
        if (accountTypeName == undefined) {
            return null;
        }
        var accountType:AccountType = AccountType[accountTypeName];
        var namedAccountType =NamedAccountType.getNamedForType(accountType);
        if (namedAccountType == null) {
            return null;
        }
        return namedAccountType.label[this.language];
    }

    onPageChanged(pagination:Pagination) {
        this.pagination = pagination;
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