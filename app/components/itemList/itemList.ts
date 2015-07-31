/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgFor, EventEmitter} from 'angular2/angular2';
import {Item, ItemService, ItemSearch} from 'services/itemService';
import {AutoFocusDirective} from 'directives/autoFocus';

@Component({
    selector: 'itemList',
    viewInjector: [ItemService],
    events: ['itemClicked']
})

@View({
    templateUrl: './components/itemList/itemList.html',
    styleUrls: ['./components/itemList/itemList.css'],
    directives: [NgFor, AutoFocusDirective]
})

export class ItemList {
    itemService: ItemService;
    items: Item[];
    itemClicked = new EventEmitter();
    itemSearch: ItemSearch;

    constructor(itemService: ItemService) {
        this.itemService = itemService;
        this.itemService.searchItems();
        this.itemSearch = new ItemSearch();
        this.itemSearch.multiSearch = null;
        this.searchItems();
    }
    searchItems() {
        this.items = this.itemService.getItems();
    }
    onFilterValueChanged($event) {
        this.applyFilter($event.target.value);
    }
    applyFilter(filterValue: string) {
        this.itemSearch.multiSearch = filterValue;
        this.items = this.itemService.findItems(this.itemSearch);
    }
    onItemClick(item: Item) {
        this.itemClicked.next(item);
    }
}
