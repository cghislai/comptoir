/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {Item} from 'client/domain/item';
import {ItemVariant} from 'client/domain/itemVariant';
import {ItemPicture} from 'client/domain/itemPicture';
import {PicturedItem, PicturedItemFactory} from 'client/utils/picture';
import {Language, LocaleTexts} from 'client/utils/lang';
import {NumberUtils} from 'client/utils/number';

import {ItemService} from 'services/item';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';

import {LangSelect, LocalizedDirective} from 'components/utils/langSelect/langSelect';

class ItemFormModel {
    item:PicturedItem;

    pictureDataURI:string;
    language:Language;
    names:LocaleTexts;
    descriptions:LocaleTexts;
    reference:string;
    vatExclusive:number;
    vatPercentage:number;

    constructor(language:Language, picturedItem?:PicturedItem) {
        this.language = language;
        if (picturedItem == undefined) {
            this.names = new LocaleTexts();
            this.descriptions = new LocaleTexts();
            return;
        } else {
            this.pictureDataURI = PicturedItemFactory.buildPictureURI(picturedItem.picture);
        }
        this.item = picturedItem;
        this.names = picturedItem.item.name;
        this.descriptions = picturedItem.item.description;
        this.reference = picturedItem.item.reference;
        this.vatExclusive = picturedItem.item.vatExclusive;
        this.vatPercentage = picturedItem.item.vatRate;
    }
}


@Component({
    selector: 'editItem'
})
@View({
    templateUrl: './routes/items/edit/editView.html',
    styleUrls: ['./routes/items/edit/editView.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, RouterLink, LangSelect, LocalizedDirective]
})
export class ItemsEdiView {
    itemService:ItemService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;

    language:Language;
    itemModel:ItemFormModel;


    constructor(itemService:ItemService, errorService:ErrorService, authService:AuthService,
                routeParams:RouteParams, router:Router) {
        this.router = router;
        this.itemService = itemService;
        this.errorService = errorService;
        this.authService = authService;
        this.language = authService.getEmployeeLanguage();

        this.findItem(routeParams);
    }

    findItem(routeParams:RouteParams) {
        if (routeParams == null || routeParams.params == null) {
            this.getNewItem();
            return;
        }
        var idParam = routeParams.get('id');
        var idNumber = parseInt(idParam);
        if (isNaN(idNumber)) {
            if (idParam == 'new') {
                this.getNewItem();
                return;
            }
            this.getNewItem();
            return;
        }
        this.getItem(idNumber);
    }

    getNewItem() {
        this.itemModel = new ItemFormModel(this.language);
    }

    getItem(id:number) {
        this.itemService.getPicturedItemVariantASync(id)
            .then((picturedItem:PicturedItem)=> {
                this.itemModel = new ItemFormModel(this.language, picturedItem);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }



    public doSaveItem() {

    }


    onPictureFileSelected(event) {
        var files = event.target.files;
        if (files.length != 1) {
            return;
        }
        var file = files[0];
        var thisView = this;

        new Promise<string>((resolve, reject)=> {
            var reader = new FileReader();
            reader.onload = function () {
                var data = reader.result;
                resolve(data);
            };
            reader.readAsDataURL(file);
        }).then((data:string)=> {
                thisView.itemModel.pictureDataURI = data;
            });
    }

    onCurrentPriceChanged(event) {
        var price = event.target.value;
        this.itemModel.vatExclusive = parseFloat(price);
    }

    onVatChanged(event) {
        var vat = event.target.value;
        this.itemModel.vatPercentage = parseInt(vat);
    }

    doSaveEdit() {
        var picturedItem = this.itemModel.item;
        if (picturedItem == null) {
            picturedItem = new PicturedItem();
        }
        var item = picturedItem.item;
        if (item == null) {
            item = new Item();
            picturedItem.item = item;
        }

        item.vatExclusive = this.itemModel.vatExclusive;
        item.vatRate = NumberUtils.toFixedDecimals(this.itemModel.vatPercentage * 0.01, 2);

        item.description = this.itemModel.descriptions;
        item.name = this.itemModel.names;
        item.reference = this.itemModel.reference;

        picturedItem.dataURI = this.itemModel.pictureDataURI;

        this.itemService.savePicturedItem(picturedItem)
            .then(() => {
                this.router.navigate('/items/list');
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });

    }

}
