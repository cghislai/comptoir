/**
 * Created by cghislai on 31/07/15.
 */
import {Component, View, NgFor, NgIf, formDirectives} from 'angular2/angular2';
import {Router} from 'angular2/router';


import {Item, ItemSearch} from 'client/domain/item';
import {SearchResult} from 'client/utils/search';
import {PicturedItem} from 'client/utils/picture';
import {LocaleTexts} from 'client/utils/lang';
import {Pagination} from 'client/utils/pagination';

import {ApplicationService} from 'services/application';
import {ItemService} from 'services/itemService';

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
    router:Router;

    itemService:ItemService;
    itemSearch:ItemSearch;
    pagination: Pagination;
    itemSearchResult:SearchResult<PicturedItem>;
    columns:ItemColumn[];
    itemsPerPage:number = 25;

    // Delay filter input keyevent for 200ms
    keyboardTimeoutSet:boolean;
    keyboardTimeout:number = 200;
    itemList:ItemList;

    constructor(appService:ApplicationService, itemService:ItemService, router:Router) {
        this.router = router;
        this.itemService = itemService;

        this.itemSearch = new ItemSearch();
        this.pagination = new Pagination(0, this.itemsPerPage);

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
        this.itemService.searchPicturedItems(this.itemSearch, this.pagination)
            .then((result:SearchResult<PicturedItem>)=> {
                this.itemSearchResult = result;
            });
    }

    onPageChanged(pagination:Pagination) {
        this.pagination = pagination;
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