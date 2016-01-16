/**
 * Created by cghislai on 29/07/15.
 */

import {Component,EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';

import {LocalItem} from '../../../../client/localDomain/item';
import {LocalItemVariant} from '../../../../client/localDomain/itemVariant';

import {ItemSearch, ItemRef} from '../../../../client/domain/item';
import {ItemVariantSearch} from '../../../../client/domain/itemVariant';
import {SearchResult, SearchRequest} from '../../../../client/utils/search';
import { PaginationFactory} from '../../../../client/utils/pagination';

import {AuthService} from '../../../../services/auth';
import {ErrorService} from '../../../../services/error';
import {ItemService} from '../../../../services/item';
import {ItemVariantService} from '../../../../services/itemVariant';

import {ItemList, ItemColumn} from '../../../item/list/itemList';
import {ItemVariantList, ItemVariantColumn} from '../../../itemVariant/list/itemVariantList';
import {AutoFocusDirective} from '../../../utils/autoFocus';
import {FocusableDirective} from '../../../utils/focusable';
import * as Immutable from 'immutable';

@Component({
    selector: 'item-list-view',
    outputs: ['itemClicked', 'variantSelected'],
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './components/sales/sale/itemList/listView.html',
    styleUrls: ['./components/sales/sale/itemList/listView.css'],
    directives: [NgFor, NgIf, AutoFocusDirective, FocusableDirective, ItemList, ItemVariantList]
})

export class ItemListView {
    itemService:ItemService;
    itemVariantService:ItemVariantService;
    errorService:ErrorService;
    authService:AuthService;

    itemClicked = new EventEmitter();
    variantSelected = new EventEmitter();
    // Delay keyevent for 500ms
    keyboardTimeoutSet:boolean;
    keyboardTimeout:number = 200;
    //
    searchRequest:SearchRequest<LocalItem>;
    searchResult:SearchResult<LocalItem>;
    columns:Immutable.List<ItemColumn>;

    variantRequest:SearchRequest<LocalItemVariant>;
    variantResult:SearchResult<LocalItemVariant>;
    variantColumns:Immutable.List<ItemVariantColumn>;
    variantSelection:boolean;

    constructor(errorService:ErrorService, itemService:ItemService,
                itemVariantService:ItemVariantService, authService:AuthService) {
        this.itemService = itemService;
        this.errorService = errorService;
        this.authService = authService;
        this.itemVariantService = itemVariantService;

        var itemSearch = new ItemSearch();
        itemSearch.multiSearch = null;
        itemSearch.locale = authService.getEmployeeLanguage().locale;
        itemSearch.companyRef = authService.getEmployeeCompanyRef();
        var pagination = PaginationFactory.Pagination({firstIndex: 0, pageSize: 20});
        this.searchRequest = new SearchRequest<LocalItem>();
        this.searchRequest.search = itemSearch;
        this.searchRequest.pagination = pagination;
        this.searchResult = new SearchResult<LocalItem>();

        var variantSearch = new ItemVariantSearch();
        variantSearch.itemSearch = new ItemSearch();
        variantSearch.itemSearch.companyRef = authService.getEmployeeCompanyRef();
        variantSearch.itemSearch.locale = authService.getEmployeeLanguage().locale;
        var variantPagination = PaginationFactory.Pagination({firstIndex: 0, pageSize: 20});
        this.variantRequest = new SearchRequest<LocalItemVariant>();
        this.variantRequest.search = variantSearch;
        this.variantRequest.pagination = variantPagination;
        this.variantResult = new SearchResult<LocalItemVariant>();
        this.variantSelection = false;

        this.columns = Immutable.List.of(
            ItemColumn.REFERENCE,
            ItemColumn.PICTURE,
            ItemColumn.NAME,
            ItemColumn.VAT_INCLUSIVE
        );
        this.variantColumns = Immutable.List.of(
            ItemVariantColumn.VARIANT_REFERENCE,
            ItemVariantColumn.PICTURE,
            ItemVariantColumn.ATTRIBUTES,
            ItemVariantColumn.TOTAL_PRICE
        );
        this.searchItems();
    }

    searchItems() {
        this.itemService.search(this.searchRequest)
            .then((result)=> {
                this.searchResult = result;
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    searchItemVariants() {
        this.itemVariantService.search(this.variantRequest)
            .then((result)=> {
                this.variantResult = result;
            })
            .catch((error)=> {
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
        var variantSearch = this.variantRequest.search.itemSearch;
        if (variantSearch.multiSearch !== filterValue) {
            variantSearch.multiSearch = filterValue;
        }
        var itemSearch = this.searchRequest.search;
        if (itemSearch.multiSearch !== filterValue) {
            itemSearch.multiSearch = filterValue;
        }

        if (this.variantSelection) {
            this.searchItemVariants();
        } else {
            this.searchItems();
        }
    }

    onItemClicked(item:LocalItem) {
        this.itemClicked.next(item);
        var variantSearch = this.variantRequest.search;
        var itemRef = new ItemRef(item.id);
        variantSearch.itemRef = itemRef;
        this.applyFilter('');
        this.itemVariantService.search(this.variantRequest)
            .then((results)=> {
                this.variantResult = results;
                if (results.count === 1) {
                    var variant = results.list.get(0);
                    this.onVariantSelected(variant);
                } else {
                    this.variantSelection = true;
                }
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onVariantSelected(variant:LocalItemVariant) {
        this.variantSelected.next(variant);
        this.variantSelection = false;
    }

    focus() {
        var element:HTMLInputElement = <HTMLInputElement>document.getElementById('itemListFilterInput');
        element.focus();
        element.select();
    }
}
