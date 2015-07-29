/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgFor} from 'angular2/angular2';
import {Item, ItemService} from 'services/itemService';

@Component({
    selector: 'itemList',
    viewInjector: [ItemService]
})

@View({
    templateUrl: './components/itemList/itemList.html',
    styleUrls: ['./components/itemList/itemList.css'],
    directives: [NgFor]
})

export class ItemList {
    itemService: ItemService;
    items: Item[];

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
        console.log(filterValue);
        this.items = this.itemService.findItems(filterValue);
    }
}
