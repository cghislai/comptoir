/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../../typings/_custom.d.ts" />
import {Component, View, NgFor, EventEmitter, ViewEncapsulation} from 'angular2/angular2';
import {Item, ItemService, ItemSearch} from 'services/itemService';
import {AutoFocusDirective} from 'directives/autoFocus';

@Component({
    selector: 'itemList',
    events: ['itemClicked']
})

@View({
    templateUrl: './components/sell/itemList/itemList.html',
    styleUrls: ['./components/sell/itemList/itemList.css'],
    directives: [NgFor, AutoFocusDirective],
    encapsulation: ViewEncapsulation.EMULATED
})

export class ItemList {
    itemService: ItemService;
    items: Item[];
    itemClicked = new EventEmitter();
    itemSearch: ItemSearch;

    constructor(itemService: ItemService) {
        this.itemService = itemService;
        this.itemSearch = new ItemSearch();
        this.itemSearch.multiSearch = null;
        this.searchItems();
    }
    searchItems() {
        this.items = this.itemService.findItems(this.itemSearch);
    }
    onFilterValueChanged($event) {
        this.applyFilter($event.target.value);
    }
    applyFilter(filterValue: string) {
        this.itemSearch.multiSearch = filterValue;
        this.searchItems();
    }
    onItemClick(item: Item) {
        this.itemClicked.next(item);
    }
}
