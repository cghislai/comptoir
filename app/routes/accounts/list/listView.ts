/**
 * Created by cghislai on 06/08/15.
 */
import {Component, View, NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {CompanyRef} from 'client/domain/company';

import {LocalAccount, LocalAccountFactory} from 'client/localDomain/account';
import {Account, AccountType, AccountSearch} from 'client/domain/account';
import {SearchResult, SearchRequest} from 'client/utils/search';
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

    searchRequest:SearchRequest<LocalAccount>
    searchResult:SearchResult<LocalAccount>;
    accountsPerPage:number = 25;

    locale:string;

    constructor(accountService:AccountService, errorService:ErrorService,
                authService:AuthService, router:Router) {
        this.accountService = accountService;
        this.errorService = errorService;
        this.router = router;

        this.searchRequest = new SearchRequest<LocalAccount>();
        var accountSearch = new AccountSearch();
        accountSearch.companyRef = new CompanyRef(authService.auth.employee.company.id);

        var pagination = new Pagination(0, this.accountsPerPage);
        this.searchRequest.search = accountSearch;
        this.searchRequest.pagination = pagination;

        this.locale = authService.getEmployeeLanguage().locale;
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

    getAccountTypeLabel(accountType:AccountType):any {
        if (accountType == null) {
            return null;
        }
        var label = LocalAccountFactory.getAccountTypeLabel(accountType);
        if (label == null) {
            return null;
        }
        return label[this.locale];
    }

    onPageChanged(pagination:Pagination) {
        this.searchRequest.pagination = pagination;
        this.searchAccounts();
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