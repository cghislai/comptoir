/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, EventEmitter} from 'angular2/angular2';

import {LocalItemVariant} from 'client/localDomain/itemVariant';
import {LocalPicture} from 'client/localDomain/picture';

import {ItemVariant, ItemVariantSearch} from 'client/domain/itemVariant';
import {SearchResult} from 'client/utils/search';
import {Pagination} from 'client/utils/pagination';

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

    itemClicked = new EventEmitter();
    columns:ItemVariantColumn[];
    // Delay keyevent for 500ms
    keyboardTimeoutSet:boolean;
    keyboardTimeout:number = 200;
    //
    itemSearch:ItemVariantSearch;
    pagination:Pagination;
    loading:boolean = false;
    searchResult:SearchResult<LocalItemVariant>;

    constructor(errorService:ErrorService, itemVariantService:ItemVariantService) {
        this.itemVariantService = itemVariantService;
        this.errorService = errorService;

        this.itemSearch = new ItemVariantSearch();
        this.itemSearch.multiSearch = null;
        this.pagination = new Pagination(0, 20);

        this.columns = [
            ItemVariantColumn.VARIANT_REFERENCE,
            ItemVariantColumn.PICTURE,
            ItemVariantColumn.ITEM_NAME_VARIANT_ATTRIBUTES,
            ItemVariantColumn.TOTAL_PRICE
        ];
        this.searchItems();
    }

    searchItems() {
        this.loading = true;
        this.itemVariantService.searchLocalItemVariantsAsync(this.itemSearch, this.pagination)
            .then((result:SearchResult<LocalItemVariant>)=> {
                this.searchResult = result;
                this.loading = false;
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
        if (this.itemSearch.multiSearch == filterValue) {
            return;
        }
        this.itemSearch.multiSearch = filterValue;
        this.searchItems();
    }

    onItemClicked(item:ItemVariant) {
        this.itemClicked.next(item);
    }

    focus() {
        var element:HTMLInputElement = <HTMLInputElement>document.getElementById('itemListFilterInput');
        element.focus();
        element.select();
    }
}
