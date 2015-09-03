/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf,
    FORM_DIRECTIVES, FormBuilder, ControlGroup, Control} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {LocalPicture, LocalPictureFactory} from 'client/localDomain/picture';
import {LocalItem} from 'client/localDomain/item';

import {Item} from 'client/domain/item';
import {ItemVariant} from 'client/domain/itemVariant';
import {Language, LocaleTexts} from 'client/utils/lang';
import {NumberUtils} from 'client/utils/number';

import {ItemService} from 'services/item';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';

import {LangSelect, LocalizedDirective} from 'components/utils/langSelect/langSelect';


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

    item:LocalItem;
    itemForm:ControlGroup;
    appLocale:string;
    editLanguage:Language;
    allLanguages:Language[];

    itemFormDefinition = {
        'pictureBlob': [null],
        'name': [''],
        'description': [''],
        'reference': [''],
        'vatExclusive': [0],
        'vatPercentage': [0]
    };


    constructor(itemService:ItemService, errorService:ErrorService, authService:AuthService,
                routeParams:RouteParams, router:Router) {
        this.router = router;
        this.itemService = itemService;
        this.errorService = errorService;
        this.authService = authService;
        this.appLocale = authService.getEmployeeLanguage().locale;
        this.editLanguage = authService.getEmployeeLanguage();

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
        this.item = new LocalItem();
    }

    getItem(id:number) {
        this.itemService.getLocalItemAsync(id)
            .then((item:LocalItem)=> {
                this.item = item;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    public doSaveItem() {
        this.itemService.saveLocalItemAsync(this.item)
            .then(() => {
                this.router.navigate('/items/list');
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
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
                if (thisView.item.mainPicture == null) {
                    thisView.item.mainPicture = new LocalPicture();
                }
                thisView.item.mainPicture.dataURI = data;
            });
    }

    onCurrentPriceChanged(event) {
        var price = event.target.value;
        var pricFloat= parseFloat(price);
        this.item.vatExclusive = NumberUtils.toFixedDecimals(pricFloat, 2);
    }

    onVatChanged(event) {
        var vat = event.target.value;
        var vatPercentage = parseInt(vat);
        this.item.vatRate = NumberUtils.toFixedDecimals(vatPercentage / 100, 2);
    }

}
