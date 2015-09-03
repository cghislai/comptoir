/**
 * Created by cghislai on 31/07/15.
 */
import {Component, View, NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {LocalItem} from 'client/localDomain/item';
import {ItemSearch} from 'client/domain/item';
import {SearchResult} from 'client/utils/search';
import {LocaleTexts} from 'client/utils/lang';
import {Pagination} from 'client/utils/pagination';

import {ErrorService} from 'services/error';
import {ItemService} from 'services/item';

import {ItemVariantList, ItemVariantColumn} from 'components/items/itemVariantList/itemList';
import {Paginator} from 'components/utils/paginator/paginator';

@Component({
    selector: "productList"
})

@View({
    templateUrl: './routes/items/list/listView.html',
    styleUrls: ['./routes/items/list/listView.css'],
    directives: [NgFor, NgIf, Paginator, FORM_DIRECTIVES, ItemVariantList]
})

export class ItemsListView {
    itemService:ItemService;
    errorService:ErrorService;
    router:Router;

    itemSearch:ItemSearch;
    pagination:Pagination;
    searchResult:SearchResult<LocalItem>;
    columns:ItemVariantColumn[];
    itemsPerPage:number = 25;

    // Delay filter input keyevent for 200ms
    keyboardTimeoutSet:boolean;
    keyboardTimeout:number = 200;

    constructor(appService:ErrorService, itemService:ItemService, router:Router) {
        this.router = router;
        this.itemService = itemService;
        this.errorService = appService;

        this.itemSearch = new ItemSearch();
        this.pagination = new Pagination(0, this.itemsPerPage);

        this.columns = [
            ItemVariantColumn.REFERENCE,
            ItemVariantColumn.PICTURE,
            ItemVariantColumn.NAME,
            ItemVariantColumn.MODEL,
            ItemVariantColumn.TVA_EXCLUSIVE,
            ItemVariantColumn.TVA_RATE,
            ItemVariantColumn.ACTION_REMOVE
        ];
        this.searchItems();
    }

    searchItems() {
        this.itemService.searchLocalItemsAsync(this.itemSearch, this.pagination)
            .then((result:SearchResult<LocalItem>)=> {
                this.searchResult = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onPageChanged(pagination:Pagination) {
        this.pagination = pagination;
        this.searchItems();
    }

    onColumnAction(event) {
        var item:LocalItem = event.itemVariant;
        var column:ItemVariantColumn = event.column;
        if (column == ItemVariantColumn.ACTION_REMOVE) {
            this.doRemoveItem(item);
        }
    }

    doEditItem(item:LocalItem) {
        var id = item.id;
        var url = '/items/edit/' + id;
        this.router.navigate(url);
    }

    doRemoveItem(item:LocalItem) {
        this.itemService.removeLocalItemAsync(item)
            .then(()=> {
                this.searchItems();
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