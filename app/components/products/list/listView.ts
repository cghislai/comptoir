/**
 * Created by cghislai on 31/07/15.
 */
import {Component, View, NgFor, formDirectives} from 'angular2/angular2';
import {Router} from 'angular2/router';


import {LocaleText} from 'client/domain/lang';
import {ItemService, Item, ItemSearch} from 'services/itemService';
import {Picture, PictureService} from 'services/pictureService';
import {Pagination, Locale} from 'services/utils';
import {ApplicationService} from 'services/application';
import {Paginator} from 'components/utils/paginator/paginator';
import {AutoFocusDirective} from 'directives/autoFocus'
import {FocusableDirective} from 'directives/focusable'

@Component({
    selector: "productList"
})

@View({
    templateUrl: './components/products/list/listView.html',
    styleUrls: ['./components/products/list/listView.css'],
    directives: [NgFor, Paginator, formDirectives]
})

export class ProductsListView {
    itemService:ItemService;
    applicationService: ApplicationService;
    appLocale: Locale;
    router: Router;

    itemSearch: ItemSearch;
    items: Item[];
    itemCount: number;
    itemsPerPage: number = 25;

    countPromise: Promise<any>;
    searchPromise: Promise<any>;
    picturePromise: Promise<any>;
    loading: boolean;

    // Delay filter input keyevent for 200ms
    keyboardTimeoutSet: boolean;
    keyboardTimeout: number = 200;

    constructor(itemService: ItemService, appService: ApplicationService, router: Router) {
        this.itemService = itemService;
        this.applicationService = appService;
        this.router = router;
        this.appLocale = appService.locale;
        this.itemSearch = new ItemSearch();
        this.itemSearch.pagination = new Pagination(0, this.itemsPerPage);
        this.searchItems();
    }

    searchItems() {
        // TODO: cancel existing promises;
        this.loading = true;
        var thisView = this;
        this.countPromise = this.itemService.countItems(this.itemSearch);
        this.countPromise.then(function(amount: number) {
            thisView.itemCount = amount;
        })
        this.searchPromise = this.itemService.findItems(this.itemSearch);
        this.searchPromise.then(function(items: Item[]) {
            thisView.items = items;
        })
        var loadPromise = Promise.all([this.countPromise, this.searchPromise]);
        loadPromise.then(function() {
            thisView.loading = false;
        })
    }
    onPageChanged(pagination: Pagination) {
        this.itemSearch.pagination = pagination;
        this.searchItems();
    }

    doEditItem(item:Item) {
        var id = item.id;
        var url = '/products/edit/'+id;
        this.router.navigate(url);
    }

    doRemoveItem(item : Item) {
        this.itemService.removeItem(item);
        this.searchItems();
    }

    handleFilterKeyUp() {
        if (this.keyboardTimeoutSet) {
            return;
        }
        this.keyboardTimeoutSet = true;
        var thisList = this;
        setTimeout(function() {
            thisList.keyboardTimeoutSet = false;
            thisList.searchItems();
        }, this.keyboardTimeout);
    }

}