/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgFor, EventEmitter} from 'angular2/angular2';
import {Item, ItemService} from 'services/itemService';
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

    constructor(itemService: ItemService) {
        this.itemService = itemService;
        this.itemService.searchItems();
        this.searchItems();
    }
    searchItems() {
        this.items = this.itemService.getItems();
    }
    onFilterValueChanged($event) {
        this.applyFilter($event.target.value);
    }
    applyFilter(filterValue: string) {
        this.items = this.itemService.findItems(filterValue);
    }
    onItemClick(item: Item) {
        this.itemClicked.next(item);
    }
}
