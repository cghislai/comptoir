/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf, formDirectives} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {Item} from 'client/domain/item';
import {ItemPicture} from 'client/domain/itemPicture';
import {PicturedItem} from 'client/utils/picture';
import {Language, LocaleTexts} from 'client/utils/lang';

import {ItemService} from 'services/itemService';
import {ApplicationService} from 'services/application';

class ItemFormModel {
    language:string;
    reference:string;
    name:LocaleTexts;
    description:LocaleTexts;
    model:string;
    price:number;
    vat:number = 21.0;
    pictureDataURI:string;
    item:PicturedItem;

    constructor();
    constructor(item:PicturedItem, lang:Language);
    constructor(item?:PicturedItem, lang?:Language) {
        if (item == undefined) {
            this.item = new PicturedItem();
            this.item.item = new Item();
            this.item.picture = new ItemPicture();
            this.name = new LocaleTexts();
            this.description = new LocaleTexts();
            return;
        }
        this.language = lang.locale;
        this.reference = item.item.reference;
        this.name = item.item.name;
        if (this.name == undefined) {
            this.name = new LocaleTexts();
        }
        this.description = item.item.description;
        if (this.description == undefined) {
            this.description = new LocaleTexts();
        }
        this.model = item.item.model;
        this.price = item.item.vatExclusive;
        this.vat = item.item.vatRate * 100;
        this.pictureDataURI = item.dataURI;
        this.item = item;
    }
}


@Component({
    selector: 'editProduct'
})
@View({
    templateUrl: './components/items/edit/editView.html',
    styleUrls: ['./components/items/edit/editView.css'],
    directives: [NgFor, NgIf, formDirectives, RouterLink]
})
export class EditProductView {
    itemId:number;
    itemService:ItemService;
    applicationService:ApplicationService;
    router:Router;

    language:Language;
    allLanguages:Language[] = Language.ALL_LANGUAGES;
    itemModel:ItemFormModel;
    lastUsedLang:Language;

    constructor(itemService:ItemService, appService:ApplicationService,
                routeParams:RouteParams, router:Router) {
        var itemIdParam = routeParams.get('id');
        this.itemId = parseInt(itemIdParam);
        if (isNaN(this.itemId)) {
            this.itemId = null;
        }
        this.router = router;
        this.itemService = itemService;
        this.applicationService = appService;
        this.language = appService.language;
        this.lastUsedLang = this.language;
        this.buildFormModel();
    }

    buildFormModel() {
        if (this.itemId == null) {
            this.itemModel = new ItemFormModel();
            this.itemModel.language = this.language.locale;
            return;
        }
        var thisView = this;

        this.itemService.getPicturedItemSync(this.itemId)
            .then((picItem:PicturedItem)=> {
                thisView.itemModel = new ItemFormModel(picItem, thisView.language);
            });
    }

    onLanguageSelected(lang:Language) {
        this.lastUsedLang = lang;
        this.itemModel.language = lang.locale;
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
            thisView.itemModel.pictureDataURI = data;
            // Triggering an event for refresh
            event.target.dispatchEvent(new Event('fileread'));
        };
        reader.readAsDataURL(file);
    }

    onCurrentPriceChanged(event) {
        var price = event.target.value;
        this.itemModel.price = parseFloat(price);
    }

    onVatChanged(event) {
        var vat = event.target.value;
        this.itemModel.vat = parseInt(vat);
    }

    doSaveEdit() {
        var item = this.itemModel.item.item;
        item.vatExclusive = this.itemModel.price;
        item.vatRate = Number((this.itemModel.vat * 0.01).toFixed(2));

        item.description = this.itemModel.description;
        item.name = this.itemModel.name;
        item.model = this.itemModel.model;
        item.reference = this.itemModel.reference;

        this.itemModel.item.dataURI = this.itemModel.pictureDataURI;
        this.itemService.savePicturedItem(this.itemModel.item).then(
            () => {
                this.router.navigate('/items/list');
            }
        );

    }

}
