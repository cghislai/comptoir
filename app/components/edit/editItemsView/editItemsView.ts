/**
 * Created by cghislai on 31/07/15.
 */
import {Component, View, NgFor, NgIf,
    FormBuilder, Form, formDirectives, Validators, ControlGroup,NgFormModel,
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
    description:string;
    model:string;
    price:number;
    vat: number;
    picture: Picture;
    item: Item;

    constructor();
    constructor(item: Item);
    constructor(item?: Item) {
        if (item == undefined) {
            this.item = new Item();
            this.picture = new Picture();
            return;
        }
        this.item = item;
        this.reference = item.reference;
        this.name = item.name.get();
        this.description = item.description.get();
        this.model = item.model;
        this.price = item.currentPrice.vatExclusive;
        this.vat = item.currentPrice.vatRate * 100;
        this.picture = item.picture;
    }
}

// Main component
@Component({
    selector: "editItemsView",
    viewInjector: [FormBuilder, PictureService]
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
    pictureService: PictureService;
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
    editingLanguage: Language;
    lastUsedLanguage: Language;

    constructor(itemService:ItemService, pictureService: PictureService,
                formBuilder:FormBuilder, applicationService:ApplicationService) {
        this.itemService = itemService;
        this.pictureService = pictureService;
        this.editingModel = null;
        this.applicationService = applicationService;
        this.lastUsedLanguage = applicationService.language;
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
        this.editingModel = new FormModel(item);
        this.picturePromise = this.itemService.findItemPicture(item);
        this.picturePromise.then(function(picture: Picture) {
            item.picture = picture;
        });
    }

    onLanguageSelected(language) {
        this.editingLanguage = language;
    }
    isLanguageSelected(language): boolean {
        return this.editingLanguage = language;
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
        this.lastUsedLanguage = this.editingLanguage;
        this.editingModel = null;
    }

    doSaveEdit() {
        this.lastUsedLanguage = this.editingLanguage;

        var item = this.editingModel.item;
        item.currentPrice.vatExclusive = this.editingModel.price;
        item.currentPrice.vatRate = Number((this.editingModel.vat * 0.01).toFixed(2));
        item.description.set(this.editingLanguage, this.editingModel.description);
        item.name.set(this.editingLanguage, this.editingModel.name);
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