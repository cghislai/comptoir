/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, EventEmitter, Query, QueryList} from 'angular2/angular2';
import {Item, ItemSearch} from 'client/domain/item';
import {ItemList, ItemColumn} from 'components/items/itemList/itemList';
import {AutoFocusDirective} from 'directives/autoFocus';
import {FocusableDirective} from 'directives/focusable';
import {Locale} from 'services/utils';
import {ApplicationService} from 'services/application';


@Component({
    selector: 'itemListView',
    events: ['itemClicked']
})

@View({
    templateUrl: './components/sales/sale/itemList/listView.html',
    styleUrls: ['./components/sales/sale/itemList/listView.css'],
    directives: [NgFor, AutoFocusDirective, FocusableDirective, ItemList]
})

export class ItemListView {
    itemClicked = new EventEmitter();
    itemSearch:ItemSearch;
    columns:ItemColumn[];
    lang:Locale;
    // Only 1 query at a time
    countPromise:Promise<any> = null;
    searchPromise:Promise<any> = null;
    picturePromise:Promise<any> = null;
    // Delay keyevent for 500ms
    keyboardTimeoutSet:boolean;
    keyboardTimeout:number = 200;
    //
    itemList: ItemList;

    constructor(applicationService:ApplicationService,
                @Query(ItemList,{descendants: true}) itemListQuery:QueryList<ItemList>) {
        this.lang = applicationService.locale;

        this.itemSearch = new ItemSearch();
        this.itemSearch.multiSearch = null;

        this.columns = [
            ItemColumn.REFERENCE,
            ItemColumn.PICTURE,
            ItemColumn.NAME_MODEL,
            ItemColumn.TVA_EXCLUSIVE
        ];
        var thisView = this;
        var queryCallback = function () {
            var first:ItemList = itemListQuery.first;
            thisView.itemList = first;
            thisView.searchItems();
            itemListQuery.removeCallback(queryCallback);
        };
        itemListQuery.onChange(queryCallback);
    }

    searchItems() {
        if (this.itemList == undefined) {
            return;
        }
        this.itemList.searchItems(this.itemSearch);
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
