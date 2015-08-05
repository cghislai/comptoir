/**
 * Created by cghislai on 31/07/15.
 */
import {Component, View, NgFor, NgIf,
    formDirectives, Validators, ControlGroup,NgFormModel,
    ViewEncapsulation} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables} from 'angular2/router';


import {LocaleText} from 'client/domain/lang';
import {ItemService, Item, ItemSearch} from 'services/itemService';
import {Picture, PictureService} from 'services/pictureService';
import {Pagination, Locale} from 'services/utils';
import {ApplicationService} from 'services/application';
import {Paginator} from 'components/utils/paginator/paginator';
import {AutoFocusDirective} from 'directives/autoFocus'
import {FocusableDirective} from 'directives/focusable'


class FormModel {
    lang:Locale;
    reference:string;
    name:string;
    nameLocaleText: LocaleText;
    description:string;
    descriptionLocaleText: LocaleText;
    model:string;
    price:number;
    vat: number;
    picture: Picture;
    item: Item;

    constructor();
    constructor(item: Item, locale: Locale);
    constructor(item?: Item, locale?: Locale) {
        if (item == undefined) {
            this.item = new Item();
            this.picture = new Picture();
            return;
        }
        this.lang = locale;
        this.item = item;
        this.reference = item.reference;
        this.name = item.name[locale.isoCode];
        this.nameLocaleText = item.name;
        this.description = item.description[locale.isoCode];
        this.descriptionLocaleText =item.description;
        this.model = item.model;
        this.price = item.currentPrice.vatExclusive;
        this.vat = item.currentPrice.vatRate * 100;
        this.picture = item.picture;
    }

    setLanguage(locale: Locale) {
        if (this.lang == locale) {
            return;
        }
        this.saveLocaleTexts();
        this.lang = locale;
        this.description = this.descriptionLocaleText[locale.isoCode];
        this.name = this.nameLocaleText[locale.isoCode];
    }

    saveLocaleTexts() {
        this.nameLocaleText[this.lang.isoCode] = this.name;
        this.descriptionLocaleText[this.lang.isoCode] = this.description;
    }
}

// Main component
@Component({
    selector: "editItemsView"
})

@View({
    templateUrl: './components/products/list/listView.html',
    styleUrls: ['./components/products/list/listView.css'],
    directives: [NgFor, NgIf, formDirectives, Paginator, AutoFocusDirective, FocusableDirective]
})

export class ProductsListView {
    itemService:ItemService;
    applicationService: ApplicationService;
    appLocale: Locale;
    allLocales: Locale[] = Locale.ALL_LOCALES;

    itemSearch: ItemSearch;
    items: Item[];
    itemCount: number;
    itemsPerPage: number = 25;

    countPromise: Promise<any>;
    searchPromise: Promise<any>;
    picturePromise: Promise<any>;
    loading: boolean;

    editingModel:FormModel;
    lastUsedLanguage: Locale;
    // Delay keyevent for 500ms
    keyboardTimeoutSet: boolean;
    keyboardTimeout: number = 200;

    constructor(itemService: ItemService, appService: ApplicationService) {
        this.itemService = itemService;
        this.applicationService = appService;
        this.appLocale = appService.locale;
        this.editingModel = null;
        this.lastUsedLanguage = this.applicationService.locale  ;
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

    doEditNewItem() {
        var item = new Item();
        this.doEditItem(item);
    }
    doEditItem(item:Item) {
        this.editingModel = new FormModel(item, this.lastUsedLanguage);
        this.picturePromise = this.itemService.findItemPicture(item);
        this.picturePromise.then(function(picture: Picture) {
            item.picture = picture;
        });
    }

    onLanguageSelected(language: Locale) {
        this.lastUsedLanguage = language;
        this.editingModel.setLanguage(language);
    }
    isLanguageSelected(language: Locale): boolean {
        return this.editingModel.lang == language;
    }
    onFileSelected(form, event) {
        var files = event.target.files;
        if (files.length != 1) {
            return;
        }
        var file = files[0];
        var reader = new FileReader();
        var thisView = this;
        reader.onload = function () {
            var data = reader.result;
            thisView.editingModel.picture.dataUrl = data;
            // Triggering an event for refresh
            event.target.dispatchEvent(new Event('fileread'));
        };
        reader.readAsDataURL(file);
    }

    onCurrentPriceChanged(event) {
        var price = event.target.value;
        this.editingModel.price = parseFloat(price);
    }
    onVatChanged(event) {
        var vat = event.target.value;
        this.editingModel.vat = parseInt(vat);
    }
    doCancelEdit() {
        this.lastUsedLanguage = this.editingModel.lang;
        this.editingModel = null;
    }

    doSaveEdit() {
        this.lastUsedLanguage = this.editingModel.lang;

        var item = this.editingModel.item;
        item.currentPrice.vatExclusive = this.editingModel.price;
        item.currentPrice.vatRate = Number((this.editingModel.vat * 0.01).toFixed(2));

        this.editingModel.saveLocaleTexts();
        item.description = this.editingModel.descriptionLocaleText;
        item.name = this.editingModel.nameLocaleText;
        item.model = this.editingModel.model;
        item.reference = this.editingModel.reference;
        item.picture = this.editingModel.picture;
        // TODO
        this.itemService.saveItem(item);
        this.editingModel = null;
        this.searchItems();
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