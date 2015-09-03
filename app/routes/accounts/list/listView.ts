/**
 * Created by cghislai on 06/08/15.
 */
import {Component, View, NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {Router} from 'angular2/router';


import {LocalAccount, LocalAccountFactory} from 'client/localDomain/account';
import {Account, AccountType, AccountSearch} from 'client/domain/account';
import {SearchResult} from 'client/utils/search';
import {LocaleTexts, Language} from 'client/utils/lang';
import {Pagination} from 'client/utils/pagination';

import {AccountService} from 'services/account';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';

import {Paginator} from 'components/utils/paginator/paginator';

@Component({
    selector: "accountsList"
})

@View({
    templateUrl: './routes/accounts/list/listView.html',
    styleUrls: ['./routes/accounts/list/listView.css'],
    directives: [NgFor, NgIf, Paginator, FORM_DIRECTIVES]
})

export class AccountsListView {
    accountService:AccountService;
    errorService:ErrorService;
    router:Router;

    accountSearch:AccountSearch;
    pagination:Pagination;
    accountSearchResult:SearchResult<Account>;
    accountCount:number;
    accountsPerPage:number = 25;

    locale:string;
    loading:boolean;

    constructor(accountService:AccountService, errorService:ErrorService,
                authService:AuthService, router:Router) {
        this.accountService = accountService;
        this.errorService = errorService;
        this.router = router;

        this.accountSearch = new AccountSearch();
        this.accountSearch.companyRef = authService.loggedEmployee.companyRef;
        this.pagination = new Pagination(0, this.accountsPerPage);

        this.locale = authService.getEmployeeLanguage().locale;
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
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    getAccountTypeLabel(accountTypeName:string):any {
        if (accountTypeName == undefined) {
            return null;
        }
        var accountType:AccountType = AccountType[accountTypeName];
        var label = LocalAccountFactory.getAccountTypeLabel(accountType);
        return label[this.locale];
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
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


}