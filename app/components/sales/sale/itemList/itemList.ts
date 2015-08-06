/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, EventEmitter, ViewEncapsulation} from 'angular2/angular2';
import {Item, ItemService, ItemSearch} from 'services/itemService';
import {AutoFocusDirective} from 'directives/autoFocus';
import {FocusableDirective} from 'directives/focusable';
import {Locale} from 'services/utils';
import {ApplicationService} from 'services/application';


@Component({
    selector: 'itemList',
    events: ['itemClicked']
})

@View({
    templateUrl: './components/sales/sale/itemList/itemList.html',
    styleUrls: ['./components/sales/sale/itemList/itemList.css'],
    directives: [NgFor, AutoFocusDirective, FocusableDirective],
    encapsulation: ViewEncapsulation.EMULATED
})

export class ItemList {
    itemService:ItemService;
    items:Item[];
    itemCount:number;
    itemClicked = new EventEmitter();
    itemSearch:ItemSearch;
    loading:boolean = false;
    lang: Locale;
    // Only 1 query at a time
    countPromise:Promise<any> = null;
    searchPromise:Promise<any> = null;
    picturePromise:Promise<any> = null;
    // Delay keyevent for 500ms
    keyboardTimeoutSet: boolean;
    keyboardTimeout: number = 200;

    constructor(itemService:ItemService, applicationService: ApplicationService) {
        this.itemService = itemService;
        this.itemSearch = new ItemSearch();
        this.itemSearch.multiSearch = null;
        this.lang = applicationService.locale;
        this.searchItems();
    }

    searchItems() {
        this.loading = true;
        var thisList = this;
        // ES7: cancel running promises
        this.countPromise = this.itemService.countItems(this.itemSearch);
        this.countPromise.then(function (amount:number) {
            thisList.itemCount = amount;
        });
        this.searchPromise = this.itemService.findItems(this.itemSearch);
        this.searchPromise.then(function (items:Item[]) {
            thisList.items = items;
        })

        var finalPromise:Promise<void> = Promise.all([
            this.countPromise,
            this.searchPromise
        ]).then(function () {
            thisList.picturePromise = thisList.itemService.findItemPictures(thisList.items);
            thisList.picturePromise.then(function () {

            });
            thisList.loading = false;
        });
    }

    onFilterKeyUp($event) {
        if (this.keyboardTimeoutSet) {
            return;
        }
        this.keyboardTimeoutSet = true;
        var thisList = this;
        setTimeout(function() {
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

    onItemClick(item:Item) {
        this.itemClicked.next(item);
    }
    focus() {
        var element:HTMLInputElement = <HTMLInputElement>document.getElementById('itemListFilterInput');
        element.focus();
        element.select();
    }
}
