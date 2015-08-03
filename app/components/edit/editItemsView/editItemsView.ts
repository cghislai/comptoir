/**
 * Created by cghislai on 31/07/15.
 */
import {Component, View, NgFor, NgIf,
    FormBuilder, Form, formDirectives, Validators, ControlGroup,NgFormModel,
    ViewEncapsulation} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables} from 'angular2/router';


import {ItemService, Item, ItemSearch} from 'services/itemService';
import {Picture, PictureService} from 'services/pictureService';
import {Pagination} from 'services/utils';
import {Language, LocalizedString, ApplicationService} from 'services/applicationService';
import {Paginator} from 'components/utils/paginator/paginator';


class ItemModel {
    lang:Language;
    reference:string;
    name:string;
    description:string;
    model:string;
    price:number;
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
        this.name = item.name.text;
        this.description = item.description.text;
        this.model = item.model.text;
        this.price = item.currentPrice;
        this.picture = item.picture;
        if (this.picture == null) {
            this.picture = new Picture();
        }
    }
}

// Took from angular2-examples
/**
 * This is a component that displays an error message.
 *
 * For instance,
 *
 * <show-error control="creditCard" [errors]="['required', 'invalidCreditCard']"></show-error>
 *
 * Will display the "is required" error if the control is empty, and "invalid credit card" if the
 * control is not empty
 * but not valid.
 *
 * In a real application, this component would receive a service that would map an error code to an
 * actual error message.
 * To make it simple, we are using a simple map here.
 */
@Component({
    selector: 'show-error', properties: ['controlPath: control', 'errorTypes: errors'],
    viewInjector: [NgFormModel]
})
@View({
    template: `
    <span *ng-if="errorMessage !== null">{{errorMessage}}</span>
  `,
    directives: [NgIf]
})
class ShowError {
    formDir;
    controlPath:string;
    errorTypes:List<string>;

    constructor(formDir:NgFormModel) {
        this.formDir = formDir;
    }

    get errorMessage() {
        var c = this.formDir.form.find(this.controlPath);
        for (var i = 0; i < this.errorTypes.length; ++i) {
            if (c != undefined && c.touched && c.hasError(this.errorTypes[i])) {
                return this._errorMessage(this.errorTypes[i]);
            }
        }
        return null;
    }

    _errorMessage(code) {
        var config = {'required': 'is required', 'invalidCreditCard': 'is invalid credit card number'};
        return config[code];
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
    directives: [NgFor, NgIf, formDirectives, Paginator, ShowError],
    encapsulation: ViewEncapsulation.EMULATED
})

export class EditItemsView {
    languages = [{lang: Language.DUTCH, text: "Néerlandais"},
        {lang: Language.ENGLISH, text: "Anglais"},
        {lang: Language.FRENCH, text: "Français"}];
    itemService:ItemService;
    pictureService: PictureService;
    applicationService: ApplicationService;

    itemSearch: ItemSearch;
    editingItem:ItemModel;
    editingLanguage: Language;
    lastUsedLanguage: Language;
    itemsPerPage: number = 25;

    constructor(itemService:ItemService, pictureService: PictureService,
                formBuilder:FormBuilder, applicationService:ApplicationService) {
        this.itemService = itemService;
        this.pictureService = pictureService;
        this.editingItem = null;
        this.applicationService = applicationService;
        this.lastUsedLanguage = applicationService.language;
        this.itemSearch = new ItemSearch();
        this.itemSearch.pagination = new Pagination(0, this.itemsPerPage);
        this.searchItems();
        console.log(itemService.itemsCount);
    }

    searchItems() {
        this.itemService.findItems(this.itemSearch);
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
        this.editingItem = new ItemModel(item);
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
            thisView.editingItem.picture.dataUrl = data;
            // Triggering an event for refresh
            event.target.dispatchEvent(new Event('fileread'));
        };
        reader.readAsDataURL(file);
    }

    onCurrentPriceChanged(event) {
        var price = event.target.value;
        this.editingItem.price = parseFloat(price);
    }
    doCancelEdit() {
        this.lastUsedLanguage = this.editingLanguage;
        this.editingItem = null;
    }

    doSaveEdit() {
        this.lastUsedLanguage = this.editingLanguage;
        this.itemService.saveItem

        var item = this.editingItem.item;
        item.currentPrice = this.editingItem.price;
        item.description = new LocalizedString(this.editingLanguage, this.editingItem.description);
        item.name = new LocalizedString(this.editingLanguage, this.editingItem.name);
        item.model= new LocalizedString(this.editingLanguage, this.editingItem.model);
        item.reference = this.editingItem.reference;
        item.picture = this.editingItem.picture;
        // TODO
        this.itemService.saveItem(item);
        this.editingItem = null;
        this.searchItems();
    }
    doRemoveItem(item : Item) {
        this.itemService.removeItem(item);
        this.searchItems();
    }

}