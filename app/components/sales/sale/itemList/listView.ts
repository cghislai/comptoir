/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, EventEmitter} from 'angular2/angular2';

import {LocalItemVariant} from 'client/localDomain/itemVariant';
import {LocalPicture} from 'client/localDomain/picture';

import {CompanyRef} from 'client/domain/company';
import {ItemSearch} from 'client/domain/item';
import {ItemVariantSearch} from 'client/domain/itemVariant';
import {SearchResult, SearchRequest} from 'client/utils/search';
import {Pagination} from 'client/utils/pagination';

import {AuthService} from 'services/auth';
import {ErrorService} from 'services/error';
import {ItemVariantService} from 'services/itemVariant';

import {ItemVariantList, ItemVariantColumn} from 'components/itemVariant/list/itemVariantList';
import {AutoFocusDirective} from 'directives/autoFocus';
import {FocusableDirective} from 'directives/focusable';


@Component({
    selector: 'itemListView',
    events: ['itemClicked']
})

@View({
    templateUrl: './components/sales/sale/itemList/listView.html',
    styleUrls: ['./components/sales/sale/itemList/listView.css'],
    directives: [NgFor, NgIf, AutoFocusDirective, FocusableDirective, ItemVariantList]
})

export class ItemListView {
    itemVariantService:ItemVariantService;
    errorService:ErrorService;
    authService: AuthService;

    itemClicked = new EventEmitter();
    columns:ItemVariantColumn[];
    // Delay keyevent for 500ms
    keyboardTimeoutSet:boolean;
    keyboardTimeout:number = 200;
    //
    searchRequest:SearchRequest<LocalItemVariant>;
    searchResult:SearchResult<LocalItemVariant>;

    constructor(errorService:ErrorService, itemVariantService:ItemVariantService, authService: AuthService) {
        this.itemVariantService = itemVariantService;
        this.errorService = errorService;
        this.authService = authService;

        var itemSearch = new ItemSearch();
        itemSearch.multiSearch = null;
        itemSearch.companyRef = new CompanyRef(authService.auth.employee.company.id);
        var itemVariantSearch = new ItemVariantSearch();
        itemVariantSearch.itemSearch = itemSearch;
        var pagination = new Pagination(0, 20);
        this.searchRequest = new SearchRequest<LocalItemVariant>();
        this.searchRequest.search = itemVariantSearch;
        this.searchRequest.pagination = pagination;

        this.columns = [
            ItemVariantColumn.VARIANT_REFERENCE,
            ItemVariantColumn.PICTURE,
            ItemVariantColumn.ITEM_NAME_VARIANT_ATTRIBUTES,
            ItemVariantColumn.TOTAL_PRICE
        ];
        this.searchItems();
    }

    searchItems() {
        this.itemVariantService.search(this.searchRequest)
            .then((result:SearchResult<LocalItemVariant>)=> {
                this.searchResult = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onFilterKeyUp($event) {
        if (this.keyboardTimeoutSet) {
            return;
        }
        this.keyboardTimeoutSet = true;
        var thisList = this;
        setTimeout(function () {
            thisList.applyFilter($event.target.value);
            thisList.keyboardTimeoutSet = false;
        }, this.keyboardTimeout);
    }

    onFilterChange($event) {
        this.applyFilter($event.target.value);
    }

    applyFilter(filterValue:string) {
        var itemSearch = this.searchRequest.search.itemSearch;
        if (itemSearch.multiSearch == filterValue) {
            return;
        }
        itemSearch.multiSearch = filterValue;
        this.searchItems();
    }

    onItemClicked(item:LocalItemVariant) {
        this.itemClicked.next(item);
    }

    focus() {
        var element:HTMLInputElement = <HTMLInputElement>document.getElementById('itemListFilterInput');
        element.focus();
        element.select();
    }
}
