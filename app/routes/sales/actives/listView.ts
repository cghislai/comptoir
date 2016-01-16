/**
 * Created by cghislai on 31/07/15.
 */
import {Component} from 'angular2/core';
import {NgIf, FORM_DIRECTIVES} from 'angular2/common';
import {Router} from 'angular2/router';

import {LocalSale} from '../../../client/localDomain/sale';
import {SaleSearch} from '../../../client/domain/sale';
import {CompanyRef} from '../../../client/domain/company';

import {PaginationFactory, PageChangeEvent, ApplyPageChangeEvent} from '../../../client/utils/pagination';
import {SearchResult, SearchRequest} from '../../../client/utils/search';

import {ErrorService} from '../../../services/error';
import {AuthService} from '../../../services/auth';
import {SaleService} from '../../../services/sale';

import {Paginator} from '../../../components/utils/paginator/paginator';
import {SaleListComponent, SaleColumn} from '../../../components/sales/list/saleList';

@Component({
    selector: 'sales-active-view',
    templateUrl: './routes/sales/actives/listView.html',
    styleUrls: ['./routes/sales/actives/listView.css'],
    directives: [SaleListComponent, NgIf, Paginator, FORM_DIRECTIVES]
})

export class ActiveSalesView {
    saleService:SaleService;
    errorService:ErrorService;
    router:Router;

    searchRequest:SearchRequest<LocalSale>;
    searchResult:SearchResult<LocalSale>;
    columns:SaleColumn[];
    salesPerPage:number = 25;

    loading:boolean;


    constructor(saleService:SaleService, errorService:ErrorService,
                router:Router, authService:AuthService) {
        this.saleService = saleService;
        this.errorService = errorService;
        this.router = router;

        this.searchRequest = new SearchRequest<LocalSale>();
        var saleSearch = new SaleSearch();
        saleSearch.companyRef = new CompanyRef(authService.auth.employee.company.id);
        saleSearch.closed = false;
        var pagination = PaginationFactory.Pagination({
            firstIndex: 0,
            pageSize: this.salesPerPage,
            sorts: {
                'DATETIME': 'desc'
            }
        });
        this.searchRequest.pagination = pagination;
        this.searchRequest.search = saleSearch;
        this.searchResult = new SearchResult<LocalSale>();

        this.columns = [
            SaleColumn.ID,
            SaleColumn.REFERENCE,
            SaleColumn.DATETIME,
            SaleColumn.VAT_EXCLUSIVE_AMOUNT,
            SaleColumn.VAT_AMOUNT,
            SaleColumn.VAT_INCLUSIVE_AMOUNT,
            SaleColumn.ACTION_REMOVE
        ];
        this.searchSales();
    }

    searchSales() {
        this.saleService
            .search(this.searchRequest)
            .then((result) => {
                this.searchResult = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onPageChanged(pageChange:PageChangeEvent) {
        this.searchRequest.pagination = ApplyPageChangeEvent(this.searchRequest.pagination, pageChange);
        this.searchSales();
    }

    onSaleClicked(sale:LocalSale) {
        this.doSwitchToSale(sale);
    }

    onColumnAction(event) {
        var col = event.column;
        var sale = event.sale;
        if (col === SaleColumn.ACTION_REMOVE) {
            this.doRemoveSale(sale);
        }
    }

    doSwitchToSale(sale:LocalSale) {
        var id = sale.id;
        this.router.navigate(['/Sales/Sale', {id: id}]);
    }

    doRemoveSale(sale:LocalSale) {
        this.saleService.remove(sale.id)
            .then((result)=> {
                this.searchSales();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

}
