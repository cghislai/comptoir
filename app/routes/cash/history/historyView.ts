/**
 * Created by cghislai on 02/08/15.
 */

import {Component, View, NgFor, NgIf} from 'angular2/angular2';

import {CompanyRef} from 'client/domain/company';
import {LocalBalance} from 'client/localDomain/balance';
import {BalanceSearch} from 'client/domain/balance';
import {Pagination} from 'client/utils/pagination';
import {SearchResult, SearchRequest} from 'client/utils/search';

import {AuthService} from 'services/auth';
import {ErrorService} from 'services/error';
import {BalanceService} from 'services/balance';

import {Paginator} from 'components/utils/paginator/paginator';

@Component({
    selector: 'historyCashView'
})
@View({
    templateUrl: './routes/cash/history/historyView.html',
    styleUrls: ['./routes/cash/history/historyView.css'],
    directives: [Paginator, NgFor, NgIf]
})
export class CashHistoryView {
    balanceService:BalanceService;
    errorService: ErrorService;

    searchRequest: SearchRequest<LocalBalance>;
    serachResult: SearchResult<LocalBalance>;
    itemsPerPage:number = 25;

    constructor(balanceService:BalanceService, errorService:ErrorService, authService: AuthService) {
        this.errorService = errorService;
        this.balanceService = balanceService;

        this.searchRequest = new SearchRequest<LocalBalance>();
        var balanceSearch = new BalanceSearch();
        balanceSearch.companyRef = new CompanyRef(authService.auth.employee.company.id);
        var pagination = new Pagination(0, this.itemsPerPage);
        this.searchRequest.pagination = pagination;
        this.searchRequest.search = balanceSearch;

        this.searchBalances();
    }

    searchBalances() {
        this.balanceService.search(this.searchRequest)
            .then((result: SearchResult<LocalBalance>)=> {
                this.serachResult = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onPageChanged(pagination:Pagination) {
        this.searchRequest.pagination = pagination;
        this.searchBalances();
    }
}
