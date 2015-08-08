/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, EventEmitter, ViewQuery, QueryList} from 'angular2/angular2';
import {Item, ItemSearch} from 'client/domain/item';
import {ItemList, ItemColumn} from 'components/items/itemList/itemList';
import {SearchResult} from 'client/utils/searchResult';
import {PicturedItem} from 'client/utils/picture';
import {AutoFocusDirective} from 'directives/autoFocus';
import {FocusableDirective} from 'directives/focusable';
import {Locale} from 'services/utils';
import {ApplicationService} from 'services/application';
import {ItemService} from 'services/itemService';


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
    itemClicked = new EventEmitter();
    columns:ItemColumn[];
    lang:Locale;
    // Delay keyevent for 500ms
    keyboardTimeoutSet:boolean;
    keyboardTimeout:number = 200;
    //
    itemService: ItemService;
    itemSearch:ItemSearch;
    itemSearchResult: SearchResult<PicturedItem>;

    constructor(applicationService:ApplicationService, itemService:ItemService) {
        this.lang = applicationService.locale;

        this.itemSearch = new ItemSearch();
        this.itemSearch.multiSearch = null;
        this.itemService = itemService;

        this.columns = [
            ItemColumn.REFERENCE,
            ItemColumn.PICTURE,
            ItemColumn.NAME_MODEL,
            ItemColumn.TVA_EXCLUSIVE
        ];
        this.searchItems();
    }

    searchItems() {
        this.itemService.searchPicturedItems(this.itemSearch)
            .then((result:SearchResult<PicturedItem>)=> {
                this.itemSearchResult = result;
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
