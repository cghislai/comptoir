/**
 * Created by cghislai on 31/07/15.
 */
import {Component, View, NgIf, formDirectives} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {Sale, SaleSearch} from 'client/domain/sale';
import {ApplicationService} from 'services/application';
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
    templateUrl: './components/sales/actives/listView.html',
    styleUrls: ['./components/sales/actives/listView.css'],
    directives: [SaleListComponent, NgIf, Paginator, formDirectives]
})

export class ActiveSalesView {
    saleService:SaleService;
    router:Router;
    language:string;

    saleSearch:SaleSearch;
    pagination:Pagination;

    salesResult:SearchResult<Sale>;
    columns: SaleColumn[];
    salesPerPage:number = 25;

    loading:boolean;


    constructor(saleService:SaleService, applicationService:ApplicationService,
                router:Router, authService:AuthService) {
        this.saleService = saleService;
        this.router = router;
        this.saleSearch = new SaleSearch();
        this.saleSearch.companyRef = authService.loggedEmployee.companyRef
        this.pagination = new Pagination(0, this.salesPerPage);
        this.language = applicationService.language.locale;
        this.columns = [
            SaleColumn.ID,
            SaleColumn.REFERENCE,
            SaleColumn.DATETIME,
            SaleColumn.VAT_AMOUNT,
            SaleColumn.VAT_EXCLUSIVE_AMOUNT,
            SaleColumn.ACTION_REMOVE
        ];
        this.searchSales();
    }

    searchSales() {
        // TODO: cancel existing promises;
        this.loading = true;
        var thisView = this;
        // TODO: filter by actives
        this.saleService
            .searchSales(this.saleSearch, this.pagination)
            .then(function (result) {
                thisView.salesResult = result;
                thisView.loading = false;
            });
    }

    onPageChanged(pagination:Pagination) {
        this.pagination = pagination;
        this.searchSales();
    }

    onSaleClicked(sale:Sale) {
        this.doSwitchToSale(sale);
    }

    onColumnAction(sale:Sale, col:SaleColumn) {
        if (col == SaleColumn.ACTION_REMOVE) {
            this.doRemoveSale(sale);
        }
    }

    doSwitchToSale(sale:Sale) {
        var id = sale.id;
        var url = '/sales/sale/' + id;
        this.router.navigate(url);
    }

    doRemoveSale(sale:Sale) {
        // TODO
    }

}