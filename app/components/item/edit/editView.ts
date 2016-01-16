/**
 * Created by cghislai on 05/08/15.
 */
import {Component, EventEmitter,OnInit, ChangeDetectionStrategy} from 'angular2/core';
import {NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/common';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {LocalPicture, LocalPictureFactory} from '../../../client/localDomain/picture';
import {LocalItem, LocalItemFactory} from '../../../client/localDomain/item';
import {LocalItemVariant} from '../../../client/localDomain/itemVariant';

import {CompanyRef} from '../../../client/domain/company';
import {ItemRef, ItemSearch} from '../../../client/domain/item';
import {ItemVariantSearch} from '../../../client/domain/itemVariant';
import {Language, LocaleTextsFactory} from '../../../client/utils/lang';
import {NumberUtils} from '../../../client/utils/number';
import {SearchRequest, SearchResult} from '../../../client/utils/search';

import {ItemService} from '../../../services/item';
import {ItemVariantService} from '../../../services/itemVariant';
import {ErrorService} from '../../../services/error';
import {AuthService} from '../../../services/auth';
import {PictureService} from '../../../services/picture';

import {LangSelect} from '../../../components/lang/langSelect/langSelect';
import {FormMessage} from '../../../components/utils/formMessage/formMessage';
import {RequiredValidator} from '../../../components/utils/validators';
import {LocalizedDirective} from '../../../components/utils/localizedInput';
import {ItemVariantList, ItemVariantColumn} from '../../../components/itemVariant/list/itemVariantList';

import * as Immutable from 'immutable';


@Component({
    selector: 'edit-item-component',
    inputs: ['item'],
    outputs: ['saved', 'cancelled'],
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './components/item/edit/editView.html',
    styleUrls: ['./components/item/edit/editView.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES,
        RouterLink, LangSelect, LocalizedDirective, FormMessage,
        ItemVariantList, RequiredValidator]
})
export class ItemEditComponent implements OnInit {
    itemService:ItemService;
    itemVariantService:ItemVariantService;
    errorService:ErrorService;
    authService:AuthService;
    pictureService:PictureService;

    item:LocalItem;
    itemJS:any;

    itemTotalPrice:number;
    itemVatPercentage:number;
    itemVatPercentageString:string;
    itemPictureTouched:boolean;

    appLanguage:Language;
    editLanguage:Language;

    itemVariantSearchRequest:SearchRequest<LocalItemVariant>;
    itemVariantSearchResult:SearchResult<LocalItemVariant>;
    itemVariantListColumns:Immutable.List<ItemVariantColumn>;

    saved = new EventEmitter();
    cancelled = new EventEmitter();

    router:Router;

    constructor(itemService:ItemService, errorService:ErrorService, pictureService:PictureService,
                authService:AuthService, itemVariantService:ItemVariantService,
                router:Router) {
        this.router = router;
        this.itemService = itemService;
        this.itemVariantService = itemVariantService;
        this.errorService = errorService;
        this.authService = authService;
        this.pictureService = pictureService;

        this.appLanguage = authService.getEmployeeLanguage();
        this.editLanguage = authService.getEmployeeLanguage();

        this.itemVariantListColumns = Immutable.List.of(
            ItemVariantColumn.VARIANT_REFERENCE,
            ItemVariantColumn.PICTURE_NO_ITEM_FALLBACK,
            ItemVariantColumn.ATTRIBUTES,
            ItemVariantColumn.TOTAL_PRICE,
            ItemVariantColumn.ACTION_REMOVE
        );
        this.itemVariantSearchRequest = new SearchRequest<LocalItemVariant>();

    }

    ngOnInit() {
        this.itemJS = this.item.toJS();
        // FIXME: causes Lifecycle tick loops
        // Should probably be handled in the background in a editItemService
        this.findItemVariants();
        this.calcTotalPrice();
        this.calcVatPercentage();
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
            .then((result)=> {
                this.itemVariantSearchResult = result;
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    public doSaveItem() {
        this.saveItem()
            .then((item)=> {
                this.saved.next(item);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    public doCancel() {
        this.cancelled.next(null);
    }

    onPictureFileSelected(event) {
        var files = event.target.files;
        if (files.length !== 1) {
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
                var mainPicture:LocalPicture = LocalPictureFactory.createNewPicture({
                    dataURI: data,
                    company: this.authService.getEmployeeCompany()
                });
                if (thisView.item.mainPicture != null) {
                    mainPicture = <LocalPicture>thisView.item.mainPicture.merge(mainPicture);
                }
                thisView.itemJS.mainPicture = mainPicture.toJS();
                thisView.itemPictureTouched = true;
            });
    }

    setItemVatRate(event) {
        var valueString = event.target.value;
        var valueNumber:number = parseInt(valueString);
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
        var valueNumber:number = parseFloat(valueString);
        if (isNaN(valueNumber)) {
            return;
        }
        var vatExclusive = NumberUtils.toFixedDecimals(valueNumber / (1 + this.item.vatRate), 2);
        this.itemJS.vatExclusive = vatExclusive;
        this.calcTotalPrice();
    }

    doAddNewVariant() {
        this.saveItem().then((item)=> {
            this.router.navigate(['/Items/Edit/EditVariant', {itemId: item.id, variantId: 'new'}]);
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
                this.itemService.save(this.item);
            });
        }
        nextTask.then(()=> {
            this.router.navigate(['/Items/Edit/EditVariant', {itemId: itemId, variantId: variantId}]);
        }).catch((error)=> {
            this.errorService.handleRequestError(error);
        });
    }

    onVariantColumnAction(event) {
        var column = event.column;
        var itemVariant:LocalItemVariant = event.itemVariant;
        if (column === ItemVariantColumn.ACTION_REMOVE) {
            this.itemVariantService.remove(itemVariant.id)
                .then(()=> {
                    this.findItemVariants();
                })
                .catch((error)=> {
                    this.errorService.handleRequestError(error);
                });
        }
    }

    private saveItem():Promise<LocalItem> {
        if (this.itemPictureTouched) {
            var picture = LocalPictureFactory.createNewPicture(this.itemJS.mainPicture);
            return this.pictureService.save(picture)
                .then((localPic:LocalPicture)=> {
                    this.itemJS.mainPicture = localPic;
                    var item = LocalItemFactory.createNewItem(this.itemJS);
                    return this.itemService.save(item);
                });
        } else {
            var item = LocalItemFactory.createNewItem(this.itemJS);
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
        this.itemVatPercentageString = vatPercentage + '';
    }

    onCancelClicked() {
        this.cancelled.next(null);
    }

}

