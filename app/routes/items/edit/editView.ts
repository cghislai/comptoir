/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf,
    FORM_DIRECTIVES, FormBuilder, ControlGroup, Control} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {LocalPicture, LocalPictureFactory} from 'client/localDomain/picture';
import {LocalItem} from 'client/localDomain/item';
import {LocalItemVariant} from 'client/localDomain/itemVariant';

import {Item, ItemRef, ItemSearch} from 'client/domain/item';
import {ItemVariant, ItemVariantSearch} from 'client/domain/itemVariant';
import {Language, LocaleTexts} from 'client/utils/lang';
import {NumberUtils} from 'client/utils/number';

import {ItemService} from 'services/item';
import {ItemVariantService} from 'services/itemVariant';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';

import {LangSelect, LocalizedDirective} from 'components/utils/langSelect/langSelect';
import {FormMessage} from 'components/utils/formMessage/formMessage';
import {percentageValidator} from 'components/utils/validators';
import {ItemVariantList, ItemVariantColumn} from 'components/itemVariant/list/itemVariantList';

import {ItemVariantEditView} from 'routes/items/edit/editVariant/editVariantView';

@Component({
    selector: 'editItem',
    viewBindings: [FormBuilder]
})
@View({
    templateUrl: './routes/items/edit/editView.html',
    styleUrls: ['./routes/items/edit/editView.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES,
        RouterLink, LangSelect, LocalizedDirective, FormMessage,
        ItemVariantList]
})
export class ItemEditView {
    itemService:ItemService;
    itemVariantService:ItemVariantService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;

    item:LocalItem;
    itemNames:LocaleTexts;
    itemDescriptions:LocaleTexts;
    itemForm:ControlGroup;
    appLocale:string;
    editLanguage:Language;

    formBuilder:FormBuilder;

    itemVariantList:LocalItemVariant[];
    itemVariantListColumns:ItemVariantColumn[];

    constructor(itemService:ItemService, errorService:ErrorService,
                authService:AuthService, itemVariantService:ItemVariantService,
                routeParams:RouteParams, router:Router, formBuilder:FormBuilder) {
        this.router = router;
        this.itemService = itemService;
        this.itemVariantService = itemVariantService;
        this.errorService = errorService;
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.appLocale = authService.getEmployeeLanguage().locale;
        this.editLanguage = authService.getEmployeeLanguage();

        this.itemVariantList = [];
        this.itemVariantListColumns = [
            ItemVariantColumn.VARIANT_REFERENCE,
            ItemVariantColumn.PICTURE,
            ItemVariantColumn.ATTRIBUTES,
            ItemVariantColumn.TOTAL_PRICE,
            ItemVariantColumn.ACTION_REMOVE
        ]
        this.findItem(routeParams);
    }

    buildForm() {
        var vatRate = this.item.vatRate;
        if (vatRate == null || vatRate == 0) {
            var country = this.authService.companyCountry;
            vatRate = country.defaultVatRate;
        }
        var vatPercentage = NumberUtils.toInt(vatRate * 100);
        this.itemForm = this.formBuilder.group({
            'reference': [this.item.reference],
            'name': [this.item.name[this.editLanguage.locale]],
            'description': [this.item.description[this.editLanguage.locale]],
            'vatExclusive': [this.item.vatExclusive],
            'vatPercentage': [vatPercentage, percentageValidator]
        });
        this.itemNames = this.item.name;
        this.itemDescriptions = this.item.description;
    }

    findItem(routeParams:RouteParams) {
        if (routeParams == null || routeParams.params == null) {
            this.getNewItem();
            return;
        }
        var idParam = routeParams.get('itemId');
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
        this.item.description = new LocaleTexts();
        this.item.name = new LocaleTexts();
        this.buildForm();
        this.itemVariantList = [];
    }

    getItem(id:number) {
        this.itemService.getLocalItemAsync(id)
            .then((item:LocalItem)=> {
                this.item = item;
                this.buildForm();
                this.findItemVariants();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    findItemVariants() {
        var itemId = this.item.id;
        if (itemId == null) {
            this.itemVariantList = [];
            return;
        }
        var variantSearch = new ItemVariantSearch();
        var itemRef = new ItemRef(itemId);
        variantSearch.itemRef = itemRef;
        variantSearch.itemSearch = new ItemSearch();
        variantSearch.itemSearch.companyRef = this.authService.loggedEmployee.companyRef;

        this.itemVariantService.searchLocalItemVariantsAsync(variantSearch, null)
            .then((result)=> {
                this.itemVariantList = result.list;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    public doSaveItem() {
        this.saveItem()
            .then(()=> {
                this.router.navigate('/items/list');
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });;
    }

    private saveItem():Promise<LocalItem> {
        var item = this.item;
        item.description = this.itemDescriptions;
        item.name = this.itemNames;
        item.reference = this.itemForm.value.reference;
        var vatExclusive = parseFloat(this.itemForm.value.vatExclusive);
        item.vatExclusive = NumberUtils.toFixedDecimals(vatExclusive, 2);
        var vatPecentage = parseInt(this.itemForm.value.vatPercentage);
        item.vatRate = NumberUtils.toFixedDecimals(vatPecentage / 100, 2);

        return this.itemService.saveLocalItemAsync(item);
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

    doAddNewVariant() {
        this.saveItem().then((item)=>{
            this.router.navigate('/items/edit/'+item.id+'/variant/new');
        }).catch((error)=> {
            this.errorService.handleRequestError(error);
        });
    }

    onVariantRowSelected(localVariant: LocalItemVariant) {
        var variantId = localVariant.id;
        this.saveItem().then((item)=>{
            this.router.navigate('/items/edit/'+item.id+'/variant/'+variantId);
        }).catch((error)=> {
            this.errorService.handleRequestError(error);
        });
    }

    onVariantColumnAction(event) {
        console.log(event);
    }
}
