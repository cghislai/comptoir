/**
 * Created by cghislai on 06/08/15.
 */
import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {CompanyRef} from '../../../client/domain/company';

import {LocalAccount} from '../../../client/localDomain/account';
import {AccountSearch} from '../../../client/domain/account';
import {SearchResult, SearchRequest} from '../../../client/utils/search';
import {Language} from '../../../client/utils/lang';
import {PaginationFactory, ApplyPageChangeEvent, PageChangeEvent} from '../../../client/utils/pagination';

import {AccountService} from '../../../services/account';
import {ErrorService} from '../../../services/error';
import {AuthService} from '../../../services/auth';

import {Paginator} from '../../../components/utils/paginator/paginator';
import {AccountList, AccountColumn} from '../../../components/account/list/accountList';

import * as Immutable from 'immutable';

@Component({
    selector: 'account-list-view',
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
    columns:Immutable.List<AccountColumn>;
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
        this.columns = Immutable.List.of(
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
        if (column === AccountColumn.ACTION_REMOVE) {
            this.doRemoveAccount(account);
        }
    }

    doEditAccount(account:LocalAccount) {
        var id = account.id;
        this.router.navigate(['/Accounts/Edit', {id: id}]);
    }

    doRemoveAccount(account:LocalAccount) {
        var thisView = this;
        this.accountService
            .remove(account.id)
            .then(()=> {
                thisView.searchAccounts();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }
}
