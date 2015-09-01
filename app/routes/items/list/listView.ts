/**
 * Created by cghislai on 31/07/15.
 */
import {Component, View, NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {Router} from 'angular2/router';


import {ItemVariant, ItemVariantSearch} from 'client/domain/item';
import {SearchResult} from 'client/utils/search';
import {PicturedItem} from 'client/utils/picture';
import {LocaleTexts} from 'client/utils/lang';
import {Pagination} from 'client/utils/pagination';

import {ErrorService} from 'services/error';
import {ItemService} from 'services/itemService';

import {ItemList, ItemColumn} from 'components/items/itemList/itemList';
import {Paginator} from 'components/utils/paginator/paginator';

@Component({
    selector: "productList"
})

@View({
    templateUrl: './routes/items/list/listView.html',
    styleUrls: ['./routes/items/list/listView.css'],
    directives: [NgFor, NgIf, Paginator, FORM_DIRECTIVES, ItemList]
})

export class ItemsListView {
    itemService:ItemService;
    errorService:ErrorService;
    router:Router;

    itemSearch:ItemVariantSearch;
    pagination:Pagination;
    itemSearchResult:SearchResult<PicturedItem>;
    itemCount:number;
    columns:ItemColumn[];
    itemsPerPage:number = 25;

    // Delay filter input keyevent for 200ms
    keyboardTimeoutSet:boolean;
    keyboardTimeout:number = 200;

    constructor(appService:ErrorService, itemService:ItemService, router:Router) {
        this.router = router;
        this.itemService = itemService;
        this.errorService = appService;

        this.itemSearch = new ItemVariantSearch();
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
        var thisView = this;
        this.itemService.searchPicturedItems(this.itemSearch, this.pagination)
            .then((result:SearchResult<PicturedItem>)=> {
                thisView.itemSearchResult = result;
                thisView.itemCount = result.count;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onPageChanged(pagination:Pagination) {
        this.pagination = pagination;
        this.searchItems();
    }

    onColumnAction(event) {
        var item:PicturedItem = event.itemVariant;
        var column:ItemColumn = event.column;
        if (column == ItemColumn.ACTION_REMOVE) {
            this.doRemoveItem(item.item);
        }
    }

    doEditItem(item:ItemVariant) {
        var id = item.id;
        var url = '/items/edit/' + id;
        this.router.navigate(url);
    }

    doRemoveItem(item:ItemVariant) {
        var thisView = this;
        this.itemService.removeItem(item)
            .then(()=> {
                thisView.searchItems();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    handleFilterKeyUp(event) {
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