/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, EventEmitter} from 'angular2/angular2';

import {ItemVariant, ItemVariantSearch} from 'client/domain/itemVariant';
import {LocalItemVariant} from 'client/localDomain/itemVariant';
import {SearchResult} from 'client/utils/search';
import {PicturedItem} from 'client/utils/picture';
import {Pagination} from 'client/utils/pagination';

import {ErrorService} from 'services/error';
import {ItemVariantService} from 'services/itemVariant';

import {ItemList, ItemColumn} from 'components/items/itemList/itemList';
import {AutoFocusDirective} from 'directives/autoFocus';
import {FocusableDirective} from 'directives/focusable';


@Component({
    selector: 'itemListView',
    events: ['itemClicked']
})

@View({
    templateUrl: './components/sales/sale/itemList/listView.html',
    styleUrls: ['./components/sales/sale/itemList/listView.css'],
    directives: [NgFor, NgIf, AutoFocusDirective, FocusableDirective, ItemList]
})

export class ItemListView {
    itemVariantService:ItemVariantService;
    errorService:ErrorService;

    itemClicked = new EventEmitter();
    columns:ItemColumn[];
    // Delay keyevent for 500ms
    keyboardTimeoutSet:boolean;
    keyboardTimeout:number = 200;
    //
    itemSearch:ItemVariantSearch;
    pagination:Pagination;
    loading:boolean = false;
    itemSearchResult:SearchResult<LocalItemVariant>;

    constructor(errorService:ErrorService, itemVariantService:ItemVariantService) {
        this.itemVariantService = itemVariantService;
        this.errorService = errorService;

        this.itemSearch = new ItemVariantSearch();
        this.itemSearch.multiSearch = null;
        this.pagination = new Pagination(0, 20);

        this.columns = [
            ItemColumn.REFERENCE,
            ItemColumn.PICTURE,
            ItemColumn.NAME_MODEL,
            ItemColumn.TVA_EXCLUSIVE
        ];
        this.searchItems();
    }

    searchItems() {
        this.loading = true;
        this.itemVariantService.searchLocalItemVariantsAsync(this.itemSearch, this.pagination)
            .then((result:SearchResult<LocalItemVariant>)=> {
                this.itemSearchResult = result;
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
