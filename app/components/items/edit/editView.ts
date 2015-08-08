/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf, formDirectives} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {LocaleText} from 'client/domain/lang';
import {Item} from 'client/domain/item';
import {ItemPicture} from 'client/domain/itemPicture';
import {PicturedItem} from 'client/utils/picture';

import {Locale} from 'services/utils';
import {ItemService} from 'services/itemService';
import {ApplicationService} from 'services/application';

class ItemFormModel {
    locale:Locale;
    reference:string;
    name:LocaleText;
    description:LocaleText;
    model:string;
    price:number;
    vat:number;
    pictureDataURI:string;
    item:PicturedItem;

    constructor();
    constructor(item:PicturedItem, locale:Locale);
    constructor(item?:PicturedItem, locale?:Locale) {
        if (item == undefined) {
            this.item = new PicturedItem();
            this.item.item = new Item();
            this.item.picture = new ItemPicture();
            this.name = new LocaleText();
            this.description = new LocaleText();
            return;
        }
        this.locale = locale;
        this.reference = item.item.reference;
        this.name = item.item.name;
        if (this.name == undefined) {
            this.name = new LocaleText();
        }
        this.description = item.item.description;
        if (this.description == undefined) {
            this.description = new LocaleText();
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

    appLocale:Locale;
    allLocales:Locale[] = Locale.ALL_LOCALES;
    itemModel:ItemFormModel;
    lastUsedLocale:Locale;

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
        this.appLocale = appService.locale;
        this.lastUsedLocale = this.appLocale;
        this.buildFormModel();
    }

    buildFormModel() {
        if (this.itemId == null) {
            this.itemModel = new ItemFormModel();
            this.itemModel.locale = this.appLocale;
            return;
        }
        var thisView = this;

        this.itemService.getPicturedItemSync(this.itemId)
            .then((picItem:PicturedItem)=> {
                thisView.itemModel = new ItemFormModel(picItem, thisView.appLocale);
            });
    }

    onLanguageSelected(locale:Locale) {
        this.lastUsedLocale = locale;
        this.itemModel.locale = locale;
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
        this.lastUsedLocale = this.itemModel.locale;

        var item = this.itemModel.item.item;
        item.vatExclusive = this.itemModel.price;
        item.vatRate = Number((this.itemModel.vat * 0.01).toFixed(2));

        item.description = this.itemModel.description;
        item.name = this.itemModel.name;
        item.model = this.itemModel.model;
        item.reference = this.itemModel.reference;

        this.itemModel.item.dataURI = this.itemModel.pictureDataURI;
        this.itemService.savePicturedItem(this.itemModel.item);

        this.router.navigate('/items/list');
    }

}
