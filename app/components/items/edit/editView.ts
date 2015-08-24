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

import {LangSelect, LocalizedDirective} from 'components/utils/langSelect/langSelect';

class ItemFormModel {
    language:Language;
    names:LocaleTexts;
    descriptions:LocaleTexts;

    reference:string;
    model:string;
    price:number;
    vat:number = 21.0;
    pictureDataURI:string;
    item:PicturedItem;

    constructor();
    constructor(item:PicturedItem);
    constructor(item?:PicturedItem) {
        if (item == undefined) {
            this.item = new PicturedItem();
            this.item.item = new Item();
            this.item.picture = new ItemPicture();
            this.names = new LocaleTexts();
            this.descriptions = new LocaleTexts();
            return;
        }
        this.reference = item.item.reference;
        this.names = item.item.name;
        if (this.names == undefined) {
            this.names = new LocaleTexts();
        }
        this.descriptions = item.item.description;
        if (this.descriptions == undefined) {
            this.descriptions = new LocaleTexts();
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
    directives: [NgFor, NgIf, formDirectives, RouterLink, LangSelect, LocalizedDirective]
})
export class EditProductView {
    itemId:number;
    itemService:ItemService;
    appService:ApplicationService;
    router:Router;

    language:Language;
    itemModel:ItemFormModel;

    constructor(itemService:ItemService, appService:ApplicationService,
                routeParams:RouteParams, router:Router) {
        var itemIdParam = routeParams.get('id');
        this.itemId = parseInt(itemIdParam);
        if (isNaN(this.itemId)) {
            this.itemId = null;
        }
        this.router = router;
        this.itemService = itemService;
        this.appService = appService;
        this.language = appService.language;
        this.buildFormModel();
    }

    buildFormModel() {
        var lastEditLanguage = this.appService.laseUsedEditLanguage;
        if (this.itemId == null) {
            this.itemModel = new ItemFormModel();
            this.itemModel.language = lastEditLanguage;
            return;
        }
        var thisView = this;
        this.itemService.getPicturedItemASync(this.itemId)
            .then((picItem:PicturedItem)=> {
                thisView.itemModel = new ItemFormModel(picItem);
                thisView.itemModel.language = lastEditLanguage;
            }).catch((error)=> {
                this.appService.handleRequestError(error);
            });
    }


    onFileSelected(form, event) {
        var files = event.target.files;
        if (files.length != 1) {
            return;
        }
        var file = files[0];
        var thisView = this;

        new Promise((resolve, reject)=> {
            var reader = new FileReader();
            reader.onload = function () {
                var data = reader.result;
                resolve(data);
            };
            reader.readAsDataURL(file);
        }).then((data)=> {
                thisView.itemModel.pictureDataURI = data;
            });
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

        item.description = this.itemModel.descriptions;
        item.name = this.itemModel.names;
        item.model = this.itemModel.model;
        item.reference = this.itemModel.reference;

        this.itemModel.item.dataURI = this.itemModel.pictureDataURI;
        this.itemService.savePicturedItem(this.itemModel.item)
            .then(() => {
                this.router.navigate('/items/list');
            }).catch((error)=> {
                this.appService.handleRequestError(error);
            });

    }

}
