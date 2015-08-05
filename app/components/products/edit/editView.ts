/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf, formDirectives} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {Locale} from 'services/utils';
import {LocaleText} from 'client/domain/lang';
import {Picture} from 'services/pictureService';
import {Item, ItemService} from 'services/itemService';
import {ApplicationService} from 'services/application';

class ItemFormModel {
    locale:Locale;
    reference:string;
    name:LocaleText;
    description:LocaleText;
    model:string;
    price:number;
    vat:number;
    picture:Picture;
    item:Item;

    constructor();
    constructor(item:Item, locale:Locale);
    constructor(item?:Item, locale?:Locale) {
        if (item == undefined) {
            this.item = new Item();
            this.picture = new Picture();
            this.name = new LocaleText();
            this.description = new LocaleText();
            return;
        }
        this.locale = locale;
        this.item = item;
        this.reference = item.reference;
        this.name = item.name;
        this.description = item.description;
        this.model = item.model;
        this.price = item.currentPrice.vatExclusive;
        this.vat = item.currentPrice.vatRate * 100;
        this.picture = item.picture;
    }
}


@Component({
    selector: 'editProduct'
})
@View({
    templateUrl: './components/products/edit/editView.html',
    styleUrls: ['./components/products/edit/editView.css'],
    directives: [NgFor, NgIf, formDirectives, RouterLink]
})
export class EditProductView {
    itemId:number;
    itemService:ItemService;
    applicationService:ApplicationService;
    router: Router;

    appLocale:Locale;
    allLocales:Locale[] = Locale.ALL_LOCALES;
    itemModel:ItemFormModel;
    lastUsedLocale:Locale;

    constructor(itemService:ItemService, appService:ApplicationService,
                routeParams:RouteParams, router: Router) {
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
        this.itemService.getItem(this.itemId)
            .then(function (item:Item) {
                thisView.itemModel = new ItemFormModel(item, thisView.appLocale);

                thisView.itemService.findItemPicture(item)
                    .then(function (picture:Picture) {
                        item.picture = picture;
                        thisView.itemModel.picture = picture;
                    })
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
            thisView.itemModel.picture.dataUrl = data;
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

        var item = this.itemModel.item;
        item.currentPrice.vatExclusive = this.itemModel.price;
        item.currentPrice.vatRate = Number((this.itemModel.vat * 0.01).toFixed(2));

        item.description = this.itemModel.description;
        item.name = this.itemModel.name;
        item.model = this.itemModel.model;
        item.reference = this.itemModel.reference;
        item.picture = this.itemModel.picture;
        // TODO
        this.itemService.saveItem(item);

        this.router.navigate('/products/list');
    }

}
