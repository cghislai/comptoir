/**
 * Created by cghislai on 31/07/15.
 */
import {Component, View, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {CompanyRef} from 'client/domain/company';
import {SaleSearch} from 'client/domain/sale';

import {LocalSale} from 'client/localDomain/sale';

import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';
import {SaleService} from 'services/sale';

import {SearchResult, SearchRequest} from 'client/utils/search';
import {Pagination} from 'client/utils/pagination';
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

    salesRequest: SearchRequest<LocalSale>;
    salesResult:SearchResult<LocalSale>;

    columns:SaleColumn[];
    salesPerPage:number = 25;

    constructor(saleService:SaleService, errorService:ErrorService,
                router:Router, authService:AuthService) {
        this.saleService = saleService;
        this.errorService = errorService;
        this.router = router;

        var saleSearch = new SaleSearch();
        saleSearch.companyRef = new CompanyRef(authService.auth.employee.company.id);
        saleSearch.closed = true;
        var pagination = new Pagination(0, this.salesPerPage);
        pagination.sorts = {
            'DATETIME': 'desc'
        };
        this.salesRequest = new SearchRequest();
        this.salesRequest.search = saleSearch;
        this.salesRequest.pagination = pagination;

        this.columns = [
            SaleColumn.ID,
            SaleColumn.REFERENCE,
            SaleColumn.DATETIME,
            SaleColumn.VAT_AMOUNT,
            SaleColumn.VAT_EXCLUSIVE_AMOUNT
        ];
        this.salesResult = new SearchResult<LocalSale>();
        this.searchSales();
    }

    searchSales() {
        this.saleService
            .searchSales(this.salesRequest)
            .then((result)=>{
                this.salesResult = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onPageChanged(pagination:Pagination) {
        this.salesRequest.pagination = pagination;
        this.searchSales();
    }

    onSaleClicked(sale:LocalSale) {
        var saleId = sale.id;
        this.router.navigate('/sales/sale/'+saleId);
    }

    onColumnAction(sale:LocalSale, col:SaleColumn) {
    }


}