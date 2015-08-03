/**
 * Created by cghislai on 31/07/15.
 */
import {Component, View, NgFor, NgIf,
    formDirectives, Validators, ControlGroup,NgFormModel,
    ViewEncapsulation} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables} from 'angular2/router';


import {ItemService, Item, ItemSearch} from 'services/itemService';
import {Picture, PictureService} from 'services/pictureService';
import {Pagination, Language, LocaleText} from 'services/utils';
import {ApplicationService} from 'services/applicationService';
import {Paginator} from 'components/utils/paginator/paginator';
import {AutoFocusDirective} from 'directives/autoFocus'


class FormModel {
    lang:Language;
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
    constructor(item: Item, language: Language);
    constructor(item?: Item, language?: Language) {
        if (item == undefined) {
            this.item = new Item();
            this.picture = new Picture();
            return;
        }
        this.lang = language;
        this.item = item;
        this.reference = item.reference;
        this.name = item.name.get(language);
        this.nameLocaleText = item.name;
        this.description = item.description.get(language);
        this.descriptionLocaleText =item.description;
        this.model = item.model;
        this.price = item.currentPrice.vatExclusive;
        this.vat = item.currentPrice.vatRate * 100;
        this.picture = item.picture;
    }

    setLanguage(language: Language) {
        if (this.lang == language) {
            return;
        }
        this.saveLocaleTexts();
        this.lang = language;
        this.description = this.descriptionLocaleText.get(language);
        this.name = this.nameLocaleText.get(language);
    }

    saveLocaleTexts() {
        this.nameLocaleText.set(this.lang, this.name);
        this.descriptionLocaleText.set(this.lang, this.description);
    }
}

// Main component
@Component({
    selector: "editItemsView"
})

@View({
    templateUrl: './components/edit/editItemsView/editItemsView.html',
    styleUrls: ['./components/edit/editItemsView/editItemsView.css'],
    directives: [NgFor, NgIf, formDirectives, Paginator, AutoFocusDirective]
})

export class EditItemsView {
    languages = [{lang: Language.DUTCH, text: "Néerlandais"},
        {lang: Language.ENGLISH, text: "Anglais"},
        {lang: Language.FRENCH, text: "Français"}];
    itemService:ItemService;
    applicationService: ApplicationService;

    itemSearch: ItemSearch;
    items: Item[];
    itemCount: number;
    itemsPerPage: number = 25;

    countPromise: Promise<any>;
    searchPromise: Promise<any>;
    picturePromise: Promise<any>;
    loading: boolean;

    editingModel:FormModel;
    lastUsedLanguage: Language;

    constructor(itemService: ItemService, appService: ApplicationService) {
        this.itemService = itemService;
        this.applicationService = appService;
        this.editingModel = null;
        this.lastUsedLanguage = this.applicationService.language;
        this.itemSearch = new ItemSearch();
        this.itemSearch.pagination = new Pagination(0, this.itemsPerPage);
        this.lastUsedLanguage = LocaleText.DEFAULT_LANGUAGE;
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

    onLanguageSelected(language: Language) {
        this.lastUsedLanguage = language;
        this.editingModel.setLanguage(language);
    }
    isLanguageSelected(language: Language): boolean {
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

}