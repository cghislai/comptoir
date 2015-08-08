/**
 * Created by cghislai on 31/07/15.
 */
import {Component, View, NgFor, formDirectives,
    Query, QueryList} from 'angular2/angular2';
import {Router} from 'angular2/router';


import {LocaleText} from 'client/domain/lang';
import {Item, ItemSearch} from 'client/domain/item';
import {Pagination} from 'client/utils/pagination';

import {ApplicationService} from 'services/application';
import {Locale} from 'services/utils';

import {ItemList, ItemColumn} from 'components/items/itemList/itemList';
import {Paginator} from 'components/utils/paginator/paginator';

@Component({
    selector: "productList"
})

@View({
    templateUrl: './components/items/list/listView.html',
    styleUrls: ['./components/items/list/listView.css'],
    directives: [NgFor, Paginator, formDirectives, ItemList]
})

export class ProductsListView {
    applicationService:ApplicationService;
    appLocale:Locale;
    router:Router;

    itemSearch:ItemSearch;
    columns:ItemColumn[];
    itemsPerPage:number = 25;

    // Delay filter input keyevent for 200ms
    keyboardTimeoutSet:boolean;
    keyboardTimeout:number = 200;
    itemList: ItemList;

    constructor(appService:ApplicationService, router:Router,
                @Query(ItemList,{descendants: true}) itemListQuery:QueryList<ItemList>) {
        this.applicationService = appService;
        this.router = router;
        this.appLocale = appService.locale;

        this.itemSearch = new ItemSearch();
        this.itemSearch.pagination = new Pagination(0, this.itemsPerPage);

        this.columns = [
            ItemColumn.REFERENCE,
            ItemColumn.PICTURE,
            ItemColumn.NAME,
            ItemColumn.MODEL,
            ItemColumn.TVA_EXCLUSIVE,
            ItemColumn.TVA_RATE,
            ItemColumn.ACTION_REMOVE
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

    onPageChanged(pagination:Pagination) {
        this.itemSearch.pagination = pagination;
        this.searchItems();
    }

    doEditItem(item:Item) {
        var id = item.id;
        var url = '/items/edit/' + id;
        this.router.navigate(url);
    }

    handleFilterKeyUp() {
        if (this.keyboardTimeoutSet) {
            return;
        }
        this.keyboardTimeoutSet = true;
        var thisList = this;
        setTimeout(function () {
            thisList.keyboardTimeoutSet = false;
            thisList.searchItems();
        }, this.keyboardTimeout);
    }

}