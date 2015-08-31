/**
 * Created by cghislai on 31/07/15.
 */
import {Component, View, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {Sale, SaleSearch} from 'client/domain/sale';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';
import {SaleService} from 'services/sale';
import {Pagination} from 'client/utils/pagination';
import {SearchResult} from 'client/utils/search';
import {Paginator} from 'components/utils/paginator/paginator';
import {SaleListComponent, SaleColumn} from 'components/sales/saleList/saleList';

@Component({
    selector: "activeSalesView"
})

@View({
    templateUrl: './components/sales/history/historyView.html',
    styleUrls: ['./components/sales/history/historyView.css'],
    directives: [SaleListComponent, NgIf, Paginator, FORM_DIRECTIVES]
})

export class SaleHistoryView {
    saleService:SaleService;
    errorService:ErrorService;
    router:Router;

    saleSearch:SaleSearch;
    pagination:Pagination;

    salesResult:SearchResult<Sale>;
    columns:SaleColumn[];
    salesPerPage:number = 25;

    loading:boolean;


    constructor(saleService:SaleService, errorService:ErrorService,
                router:Router, authService:AuthService) {
        this.saleService = saleService;
        this.errorService = errorService;
        this.router = router;
        this.saleSearch = new SaleSearch();
        this.saleSearch.companyRef = authService.loggedEmployee.companyRef;
        this.saleSearch.closed = true;
        this.pagination = new Pagination(0, this.salesPerPage);
        this.pagination.sorts = {
            'DATETIME': 'desc'
        };
        this.columns = [
            SaleColumn.ID,
            SaleColumn.REFERENCE,
            SaleColumn.DATETIME,
            SaleColumn.VAT_AMOUNT,
            SaleColumn.VAT_EXCLUSIVE_AMOUNT
        ];
        this.searchSales();
    }

    searchSales() {
        this.loading = true;
        var thisView = this;
        this.saleService
            .searchSales(this.saleSearch, this.pagination)
            .then(function (result) {
                thisView.salesResult = result;
                thisView.loading = false;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onPageChanged(pagination:Pagination) {
        this.pagination = pagination;
        this.searchSales();
    }

    onSaleClicked(sale:Sale) {
        var saleId = sale.id;
        this.router.navigate('/sales/sale/'+saleId);
    }

    onColumnAction(sale:Sale, col:SaleColumn) {
    }


}