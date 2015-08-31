/**
 * Created by cghislai on 02/08/15.
 */

import {Component, View, NgFor, NgIf} from 'angular2/angular2';

import {Balance, BalanceSearch} from 'client/domain/balance';
import {Pagination} from 'client/utils/pagination';
import {SearchResult} from 'client/utils/search';

import {ErrorService} from 'services/error';
import {BalanceService} from 'services/balance';

import {Paginator} from 'components/utils/paginator/paginator';

@Component({
    selector: 'historyCashView'
})
@View({
    templateUrl: './components/cash/history/historyView.html',
    styleUrls: ['./components/cash/history/historyView.css'],
    directives: [Paginator, NgFor, NgIf]
})
export class CashHistoryView {
    balanceService:BalanceService;
    errorService: ErrorService;

    balanceSearch:BalanceSearch;
    pagination:Pagination;
    itemsPerPage:number = 25;
    result:SearchResult<Balance>;

    constructor(balanceService:BalanceService, errorService:ErrorService) {
        this.errorService = errorService;
        this.balanceService = balanceService;
        this.balanceSearch = new BalanceSearch();
        this.pagination = new Pagination(0, this.itemsPerPage);
        this.searchBalances();
    }

    searchBalances() {
        this.balanceService.searchBalancesAsync(this.balanceSearch, this.pagination)
            .then((result)=> {
                this.result = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onPageChanged(pagination:Pagination) {
        this.pagination = pagination;
        this.searchBalances();
    }
}
