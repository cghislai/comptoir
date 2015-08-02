/**
 * Created by cghislai on 31/07/15.
 */
import {Component, View, NgFor, NgIf,
    FormBuilder, Form, formDirectives, Validators, ControlGroup,NgFormModel,
    ViewEncapsulation} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables} from 'angular2/router';


import {ItemService, Item} from 'services/itemService';
import {Language, LocalizedString, ApplicationService} from 'services/applicationService';
import {Pagination, Paginator} from 'components/utils/paginator/paginator';


class ItemModel {
    lang:Language;
    reference:string;
    name:string;
    description:string;
    model:string;
    price:number;
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
    viewInjector: [FormBuilder]
})

@View({
    templateUrl: './components/edit/editItemsView/editItemsView.html',
    styleUrls: ['./components/edit/editItemsView/editItemsView.css'],
    directives: [NgFor, NgIf, formDirectives, Paginator],
    encapsulation: ViewEncapsulation.EMULATED
})

export class EditItemsView {
    itemService:ItemService;
    applicationService: ApplicationService;
    editingItem:Item;
    languages = [{lang: Language.DUTCH, text: "Néerlandais"},
        {lang: Language.ENGLISH, text: "Anglais"},
        {lang: Language.FRENCH, text: "Français"}];
    editForm:ControlGroup;
    formBuilder: FormBuilder;
    lastUsedLanguage: Language;


    constructor(itemService:ItemService, formBuilder:FormBuilder, applicationService:ApplicationService) {
        this.itemService = itemService;
        itemService.searchItems();
        this.editingItem = null;
        this.formBuilder = formBuilder;
        this.applicationService = applicationService;
        this.lastUsedLanguage = applicationService.language;
    }

    doEditNewItem() {
        var item = new Item();
        this.doEditItem(item);
    }
    doEditItem(item:Item) {
        this.editingItem = item;
        this.editForm = this.formBuilder.group({
            lang: [this.lastUsedLanguage],
            reference: [item.reference],
            name: [item.name.text],
            description: [item.description.text],
            model: [item.model.text],
            currentPrice: [item.currentPrice]
        });
    }

    onLanguageSelected(language) {
        this.editForm.value.lang = language.lang
    }
    isLanguageSelected(language): boolean {
        return this.editForm.value.lang == language.lang;
    }
    doCancelEdit() {
        var lang = this.editForm.value.lang;
        this.lastUsedLanguage = lang;
        this.editingItem = null;
    }

    doSaveEdit() {
        var formValue = this.editForm.value;
        var lang = formValue.lang;
        this.lastUsedLanguage = lang;

        this.editingItem.fromParams(formValue);
        this.itemService.saveItem
        (this.editingItem);
        // TODO
        this.editingItem = null;
    }
    doRemoveItem(item : Item) {
        this.itemService.removeItem(item);
    }
    onPageChanged(pagination: Pagination) {
        console.log(pagination);
    }
}