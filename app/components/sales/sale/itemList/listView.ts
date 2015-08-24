/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, EventEmitter} from 'angular2/angular2';

import {Item, ItemSearch} from 'client/domain/item';
import {SearchResult} from 'client/utils/search';
import {PicturedItem} from 'client/utils/picture';
import {Pagination} from 'client/utils/pagination';

import {ApplicationService} from 'services/application';
import {ItemService} from 'services/itemService';

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
    itemService:ItemService;
    appService:ApplicationService;

    itemClicked = new EventEmitter();
    columns:ItemColumn[];
    language:string;
    // Delay keyevent for 500ms
    keyboardTimeoutSet:boolean;
    keyboardTimeout:number = 200;
    //
    itemSearch:ItemSearch;
    pagination:Pagination;
    loading:boolean = false;
    itemSearchResult:SearchResult<PicturedItem>;

    constructor(applicationService:ApplicationService, itemService:ItemService) {
        this.itemService = itemService;
        this.appService = applicationService;

        this.language = applicationService.language.locale;

        this.itemSearch = new ItemSearch();
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
        var thisView = this;
        this.loading = true;
        this.itemService.searchPicturedItems(this.itemSearch, this.pagination)
            .then((result:SearchResult<PicturedItem>)=> {
                thisView.itemSearchResult = result;
                thisView.loading = false;
            }).catch((error)=> {
                this.appService.handleRequestError(error);
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

    onItemClicked(item:Item) {
        this.itemClicked.next(item);
    }

    focus() {
        var element:HTMLInputElement = <HTMLInputElement>document.getElementById('itemListFilterInput');
        element.focus();
        element.select();
    }
}
