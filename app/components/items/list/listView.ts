/**
 * Created by cghislai on 31/07/15.
 */
import {Component, View, NgFor, NgIf, formDirectives,
    Query, QueryList} from 'angular2/angular2';
import {Router} from 'angular2/router';


import {LocaleText} from 'client/domain/lang';
import {Item, ItemSearch} from 'client/domain/item';
import {SearchResult} from 'client/utils/searchResult';
import {PicturedItem} from 'client/utils/picture';
import {Pagination} from 'client/utils/pagination';
import {ItemService} from 'services/itemService';

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
    directives: [NgFor,NgIf, Paginator, formDirectives, ItemList]
})

export class ProductsListView {
    applicationService:ApplicationService;
    appLocale:Locale;
    router:Router;

    itemService:ItemService;
    itemSearch:ItemSearch;
    itemSearchResult:SearchResult<PicturedItem>;
    columns:ItemColumn[];
    itemsPerPage:number = 25;

    // Delay filter input keyevent for 200ms
    keyboardTimeoutSet:boolean;
    keyboardTimeout:number = 200;
    itemList:ItemList;

    constructor(appService:ApplicationService, itemService:ItemService, router:Router) {
        this.applicationService = appService;
        this.router = router;
        this.appLocale = appService.locale;
        this.itemService = itemService;

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
        this.searchItems();
    }

    searchItems() {
        this.itemService.searchPicturedItems(this.itemSearch)
            .then((result:SearchResult<PicturedItem>)=> {
                this.itemSearchResult = result;
            });
    }

    onPageChanged(pagination:Pagination) {
        this.itemSearch.pagination = pagination;
        this.searchItems();
    }

    onColumnAction(event) {
        var item : PicturedItem = event.item;
        var column: ItemColumn = event.column;
        if (column == ItemColumn.ACTION_REMOVE) {
            this.doRemoveItem(item.item);
        }
    }

    doEditItem(item:Item) {
        var id = item.id;
        var url = '/items/edit/' + id;
        this.router.navigate(url);
    }

    doRemoveItem(item: Item) {
        var thisView = this;
        this.itemService.removeItem(item)
        .then(()=>{
                thisView.searchItems();
            });
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