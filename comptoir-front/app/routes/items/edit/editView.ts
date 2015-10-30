/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {LocalPicture, LocalPictureFactory, NewPicture} from 'client/localDomain/picture';
import {LocalItem, NewItem} from 'client/localDomain/item';
import {LocalItemVariant} from 'client/localDomain/itemVariant';

import {CompanyRef} from 'client/domain/company';
import {Item, ItemRef, ItemSearch} from 'client/domain/item';
import {ItemVariant, ItemVariantSearch} from 'client/domain/itemVariant';
import {Language, LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {NumberUtils} from 'client/utils/number';
import {SearchRequest, SearchResult} from 'client/utils/search';

import {ItemService} from 'services/item';
import {ItemVariantService} from 'services/itemVariant';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';
import {PictureService} from 'services/picture';

import {LangSelect} from 'components/lang/langSelect/langSelect';
import {FormMessage} from 'components/utils/formMessage/formMessage';
import {RequiredValidator} from 'components/utils/validators';
import {LocalizedDirective} from 'components/utils/localizedInput';
import {ItemVariantList, ItemVariantColumn} from 'components/itemVariant/list/itemVariantList';

import {ItemVariantEditView} from 'routes/items/edit/editVariant/editVariantView';
import {List, Map} from 'immutable';


@Component({
    selector: 'editItem'
})
@View({
    templateUrl: './routes/items/edit/editView.html',
    styleUrls: ['./routes/items/edit/editView.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES,
        RouterLink, LangSelect, LocalizedDirective, FormMessage,
        ItemVariantList, RequiredValidator]
})
export class ItemEditView {
    itemService:ItemService;
    itemVariantService:ItemVariantService;
    errorService:ErrorService;
    authService:AuthService;
    pictureService:PictureService;
    router:Router;

    item:LocalItem;
    itemJS: any;
    itemTotalPrice: number;
    itemVatPercentage: number;
    itemVatPercentageString: string;
    itemPictureTouched:boolean;
    appLanguage:Language;
    editLanguage:Language;

    itemVariantSearchRequest:SearchRequest<LocalItemVariant>;
    itemVariantSearchResult:SearchResult<LocalItemVariant>;
    itemVariantListColumns:List<ItemVariantColumn>;

    constructor(itemService:ItemService, errorService:ErrorService, pictureService:PictureService,
                authService:AuthService, itemVariantService:ItemVariantService,
                routeParams:RouteParams, router:Router) {
        this.router = router;
        this.itemService = itemService;
        this.itemVariantService = itemVariantService;
        this.errorService = errorService;
        this.authService = authService;
        this.pictureService = pictureService;

        this.appLanguage = authService.getEmployeeLanguage();
        this.editLanguage = authService.getEmployeeLanguage();

        this.itemVariantListColumns = List.of(
            ItemVariantColumn.VARIANT_REFERENCE,
            ItemVariantColumn.PICTURE_NO_ITEM_FALLBACK,
            ItemVariantColumn.ATTRIBUTES,
            ItemVariantColumn.TOTAL_PRICE,
            ItemVariantColumn.ACTION_REMOVE
        );
        this.itemVariantSearchRequest = new SearchRequest<LocalItemVariant>();

        this.itemVariantSearchResult = new SearchResult<LocalItemVariant>();
        this.itemVariantSearchResult.list = List([]);

        this.findItem(routeParams);
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
        var itemDesc:any = {};
        itemDesc.description = LocaleTextsFactory.toLocaleTexts({});
        itemDesc.name = LocaleTextsFactory.toLocaleTexts({});
        itemDesc.company = this.authService.getEmployeeCompany();
        this.item = NewItem(itemDesc);
        this.itemJS = this.item.toJS();

        this.findItemVariants();
        this.calcTotalPrice();
        this.calcVatPercentage();
    }

    getItem(id:number) {
        this.itemService.get(id)
            .then((item:LocalItem)=> {
                this.item = item;
                this.itemJS = this.item.toJS();
                this.findItemVariants();
                this.calcTotalPrice();
                this.calcVatPercentage();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    findItemVariants() {
        var itemId = this.item.id;
        if (itemId == null) {
            return;
        }
        var variantSearch = new ItemVariantSearch();
        var itemRef = new ItemRef(itemId);
        variantSearch.itemRef = itemRef;
        variantSearch.itemSearch = new ItemSearch();
        variantSearch.itemSearch.companyRef = new CompanyRef(this.authService.auth.employee.company.id);
        this.itemVariantSearchRequest.search = variantSearch;

        this.itemVariantService.search(this.itemVariantSearchRequest)
            .then((result)=>{
                this.itemVariantSearchResult = result;
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    public doSaveItem() {
        this.saveItem()
            .then(()=> {
                this.router.navigate('/items/list');
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        ;
    }

    private saveItem():Promise<LocalItem> {
        if (this.itemPictureTouched) {
            var picture = NewPicture(this.itemJS.mainPicture);
            return this.pictureService.save(picture)
                .then((localPic:LocalPicture)=> {
                    this.itemJS.mainPicture = localPic;
                    var item = NewItem(this.itemJS);
                    return this.itemService.save(item);
                });
        } else {
            var item = NewItem(this.itemJS);
            return this.itemService.save(item);
        }
    }

    private calcTotalPrice() {
        var totalPrice = this.itemJS.vatExclusive * (1 + this.itemJS.vatRate);
        totalPrice = NumberUtils.toFixedDecimals(totalPrice, 2);
        this.itemTotalPrice = totalPrice;
    }

    private calcVatPercentage() {
        var vatPercentage = NumberUtils.toInt(this.itemJS.vatRate * 100);
        this.itemVatPercentage = vatPercentage;
        this.itemVatPercentageString = vatPercentage+'';
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
                var mainPicture: LocalPicture = NewPicture({
                    dataURI: data,
                    company: this.authService.getEmployeeCompany()
                });
                if (thisView.item.mainPicture !== null) {
                    mainPicture = <LocalPicture>thisView.item.mainPicture.merge(mainPicture);
                }
                thisView.itemJS.mainPicture = mainPicture.toJS();
                thisView.itemPictureTouched = true;
            });
    }

    setItemVatRate(event) {
        var valueString = event.target.value;
        var valueNumber: number = parseInt(valueString);
        if (isNaN(valueNumber)) {
            return;
        }
        var vatRate = NumberUtils.toFixedDecimals(valueNumber / 100, 2);
        this.itemJS.vatRate = vatRate;
        this.calcTotalPrice();
        this.calcVatPercentage();
    }

    setItemTotalPrice(event) {
        var valueString = event.target.value;
        var valueNumber: number = parseFloat(valueString);
        if (isNaN(valueNumber)) {
            return;
        }
        var vatExclusive = NumberUtils.toFixedDecimals(valueNumber / (1 + this.item.vatRate), 2);
        this.itemJS.vatExclusive = vatExclusive;
        this.calcTotalPrice();
    }

    doAddNewVariant() {
        this.saveItem().then((item)=> {
            this.router.navigate('/items/edit/' + item.id + '/variant/new');
        }).catch((error)=> {
            this.errorService.handleRequestError(error);
        });
    }

    onVariantRowSelected(localVariant:LocalItemVariant) {
        var variantId = localVariant.id;
        var itemId = this.item.id;
        var nextTask = Promise.resolve();
        if (itemId == null) {
            nextTask.then(()=> {
                this.itemService.save(this.item)
            });
        }
        nextTask.then(()=> {
            this.router.navigate('/items/edit/' + itemId + '/variant/' + variantId);
        }).catch((error)=> {
            this.errorService.handleRequestError(error);
        });
    }

    onVariantColumnAction(event) {
        var column = event.column;
        var itemVariant:LocalItemVariant = event.itemVariant;
        ;
        if (column == ItemVariantColumn.ACTION_REMOVE) {
            this.itemVariantService.remove(itemVariant)
                .then(()=> {
                    this.findItemVariants();
                })
                .catch((error)=> {
                    this.errorService.handleRequestError(error);
                });
        }
    }
}
