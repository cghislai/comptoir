/**
 * Created by cghislai on 06/08/15.
 */
import {Component, View} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {CompanyRef} from 'client/domain/company';

import {LocalAccount, LocalAccountFactory} from 'client/localDomain/account';
import {Account, AccountType, AccountSearch} from 'client/domain/account';
import {SearchResult, SearchRequest} from 'client/utils/search';
import {LocaleTexts, Language} from 'client/utils/lang';
import {Pagination, PaginationFactory, ApplyPageChangeEvent, PageChangeEvent} from 'client/utils/pagination';

import {AccountService} from 'services/account';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';

import {Paginator} from 'components/utils/paginator/paginator';
import {AccountList, AccountColumn} from 'components/account/list/accountList';

import {List} from 'immutable';

@Component({
    selector: "accountListView"
})

@View({
    templateUrl: './routes/accounts/list/listView.html',
    styleUrls: ['./routes/accounts/list/listView.css'],
    directives: [AccountList, Paginator]
})

export class AccountsListView {
    accountService:AccountService;
    errorService:ErrorService;
    router:Router;

    searchRequest:SearchRequest<LocalAccount>;
    searchResult:SearchResult<LocalAccount>;
    columns:List<AccountColumn>;
    accountsPerPage:number = 25;

    language:Language;

    constructor(accountService:AccountService, errorService:ErrorService,
                authService:AuthService, router:Router) {
        this.accountService = accountService;
        this.errorService = errorService;
        this.router = router;

        this.searchRequest = new SearchRequest<LocalAccount>();
        var accountSearch = new AccountSearch();
        accountSearch.companyRef = new CompanyRef(authService.auth.employee.company.id);

        var pagination = PaginationFactory.Pagination({firstIndex: 0, pageSize: this.accountsPerPage});
        this.searchRequest.search = accountSearch;
        this.searchRequest.pagination = pagination;
        this.searchResult = new SearchResult<LocalAccount>();

        this.language = authService.getEmployeeLanguage();
        this.columns = List.of(
            AccountColumn.NAME,
            AccountColumn.DESCRIPTION,
            AccountColumn.TYPE,
            AccountColumn.ACCOUNTING_NUMBER,
            AccountColumn.IBAN,
            AccountColumn.BIC,
            AccountColumn.ACTION_REMOVE
        );
        this.searchAccounts();
    }

    searchAccounts() {
        this.accountService
            .search(this.searchRequest)
            .then((result:SearchResult<LocalAccount>)=> {
                this.searchResult = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onPageChanged(pageChange:PageChangeEvent) {
        this.searchRequest.pagination = ApplyPageChangeEvent(this.searchRequest.pagination, pageChange);
        this.searchAccounts();
    }

    onColumnAction(event) {
        var account:LocalAccount = event.account;
        var column:AccountColumn = event.column;
        if (column == AccountColumn.ACTION_REMOVE) {
            this.doRemoveAccount(account);
        }
    }

    doEditAccount(account:LocalAccount) {
        var id = account.id;
        var url = '/accounts/edit/' + id;
        this.router.navigate(url);
    }

    doRemoveAccount(account:LocalAccount) {
        var thisView = this;
        this.accountService
            .remove(account)
            .then(()=> {
                thisView.searchAccounts();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


}