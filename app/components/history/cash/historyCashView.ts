/**
 * Created by cghislai on 02/08/15.
 */

import {Component, View, NgFor} from 'angular2/angular2';
import {CashState, CashStateSearch, CashService} from 'services/cashService';
import {Pagination} from 'services/utils';
import {Paginator} from 'components/utils/paginator/paginator';

@Component({
    selector: 'historyCashView'
})
@View({
    templateUrl: './components/history/cash/historyCashView.html',
    styleUrls: ['./components/history/cash/historyCashView.css'],
    directives: [Paginator, NgFor]
})
export class HistoryCashView {

    cashService:CashService;
    cashSearch:CashStateSearch;
    itemsPerPage:number = 25;

    constructor(cashService:CashService) {
        this.cashService = cashService;
        this.cashSearch = new CashStateSearch();
        this.cashSearch.pagination = new Pagination(0, this.itemsPerPage);
        this.searchCash();
    }

    searchCash() {
        this.cashService.findCashStates(this.cashSearch);
    }

    onPageChanged(pagination:Pagination) {
        this.cashSearch.pagination = pagination;
    }
}
