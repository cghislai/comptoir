/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, EventEmitter, OnChanges, FORM_DIRECTIVES} from 'angular2/angular2';

import {CompanyRef} from 'client/domain/company';
import {SaleRef} from 'client/domain/sale';
import {ItemVariantSaleSearch} from 'client/domain/itemVariantSale';

import {LocalSale} from 'client/localDomain/sale';
import {LocalItemVariant} from 'client/localDomain/itemVariant';
import {LocalItemVariantSale} from 'client/localDomain/itemVariantSale';

import {LocaleTexts, Language} from 'client/utils/lang';
import {NumberUtils} from 'client/utils/number';
import {SearchRequest, SearchResult} from 'client/utils/search';

import {SaleService} from 'services/sale';
import {ItemVariantSaleService} from 'services/itemVariantSale';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';

import {AutoFocusDirective} from 'components/utils/autoFocus';
import {FastInput} from 'components/utils/fastInput';
import {LangSelect} from 'components/lang/langSelect/langSelect';
import {LocalizedDirective} from 'components/utils/localizedInput'


// The component
@Component({
    selector: 'commandView',
    events: ['validate', 'saleEmptied'],
    properties: ['sale', 'validated', 'noInput']
})

@View({
    templateUrl: './components/sales/sale/commandView/commandView.html',
    styleUrls: ['./components/sales/sale/commandView/commandView.css'],
    directives: [AutoFocusDirective, LocalizedDirective, FastInput, NgFor, NgIf, FORM_DIRECTIVES]
})

export class CommandView implements OnChanges {
    saleService:SaleService;
    itemVariantSaleService:ItemVariantSaleService;
    errorService:ErrorService;

    sale:LocalSale;
    saleItemsRequest:SearchRequest<LocalItemVariantSale>;
    saleItemsResult:SearchResult<LocalItemVariantSale>;

    language:Language;
    locale:string;
    noInput:boolean;

    editingItem:LocalItemVariantSale = null;
    editingItemQuantity:boolean;
    editingItemPrice:boolean;
    editingItemComment:boolean;
    editingItemDiscount:boolean;
    editingValue:any;

    editingSaleDiscount:boolean = false;
    validate = new EventEmitter();
    validated:boolean = false;
    saleEmptied = new EventEmitter();

    constructor(saleService:SaleService, itemVariantSaleService:ItemVariantSaleService,
                authService:AuthService,
                errorService:ErrorService) {
        this.saleService = saleService;
        this.itemVariantSaleService = itemVariantSaleService;
        this.errorService = errorService;
        this.language = authService.getEmployeeLanguage();
        this.locale = authService.getEmployeeLanguage().locale;

        this.saleItemsRequest = new SearchRequest<LocalItemVariantSale>();
        var search = new ItemVariantSaleSearch();
        search.companyRef = new CompanyRef(authService.auth.employee.company.id);
        this.saleItemsRequest.search = search;

        this.saleItemsResult = new SearchResult<LocalItemVariantSale>();
        this.saleItemsResult.count = 0;
        this.saleItemsResult.list = [];

    }


    onChanges(changes:StringMap<string, any>):void {
        var saleChanges = changes.get('sale');
        if (saleChanges != null) {
            var newSale = saleChanges.currentValue;
            if (newSale != null) {
                this.searchItems();
            }
        }
    }

    OnChanges(changes: any) {
    }

    searchItems() : Promise<any>{
        var search = this.saleItemsRequest.search;
        search.saleRef = new SaleRef(this.sale.id);
        if (this.sale.id == null) {
            return;
        }
        return this.itemVariantSaleService.search(this.saleItemsRequest, this.saleItemsResult)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    doValidate() {
        this.validated = true;
        this.validate.next(this.validated);
    }

    doUnvalidate() {
        this.validated = false;
        this.validate.next(this.validated);
    }

    doRemoveItem(localItemVariantSale:LocalItemVariantSale) {
        var newItems: LocalItemVariantSale[] = [];
        for (var existingItemSale of this.saleItemsResult.list) {
            if (existingItemSale == localItemVariantSale) {
                continue
            }
            newItems.push(existingItemSale);
        }
        this.saleItemsResult.list = newItems;

        this.itemVariantSaleService.remove(localItemVariantSale)
            .then(()=> {
                var taskList = [
                    this.saleService.refresh(this.sale),
                    this.searchItems()
                ];
                return Promise.all(taskList);
            })
            .then(()=>{
                if (this.saleItemsResult.list.length == 0) {
                    this.saleEmptied.next(null);
                }
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    doAddItem(itemVariant:LocalItemVariant) {
        var existingItem:LocalItemVariantSale = null;
        for (var existingItemSale of this.saleItemsResult.list) {
            if (existingItemSale.itemVariant.id == itemVariant.id) {
                existingItem = existingItemSale;
                break;
            }
        }
        var newItem = existingItem == null;
        if (newItem) {
            existingItemSale = new LocalItemVariantSale();
            existingItemSale.comment = new LocaleTexts();
            existingItemSale.discountRatio = 0;
            existingItemSale.itemVariant = itemVariant;
            existingItemSale.quantity = 1;
            existingItemSale.sale = this.sale;
            existingItemSale.vatExclusive = itemVariant.item.vatExclusive;
            existingItemSale.vatRate = itemVariant.item.vatRate;
            if (this.saleItemsResult != null) {
                this.saleItemsResult.list.push(existingItemSale);
                this.saleItemsResult.count++;
            }
        } else {
            existingItemSale.quantity += 1;
        }
        return this.itemVariantSaleService.save(existingItemSale)
            .then((localItemSale:LocalItemVariantSale)=> {
                var taskList: Promise<any>[] = [
                    this.itemVariantSaleService.refresh(existingItemSale),
                    this.saleService.refresh(this.sale)
                ]
                if (newItem) {
                    taskList.push(this.searchItems());
                }
                return Promise.all(taskList);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    // Validators

    validateQuantity(value:string) {
        if (value.length > 0) {
            var intValue = parseInt(value);
            if (isNaN(intValue)) {
                return false;
            }
            return intValue > 0;
        }
        return true;
    }

    validateDiscount(value:string) {
        if (value.length > 0) {
            var intValue = parseInt(value);
            if (isNaN(intValue)) {
                return false;
            }
            return intValue >= 0 && intValue <= 100;
        }
        return true;
    }

    validatePrice(value:string) {
        if (value.length > 0) {

            var floatValue = parseFloat(value);
            if (isNaN(floatValue)) {
                return false;
            }
            return floatValue > 0;
        }
        return true;
    }

    // Edits

    cancelEdits() {
        this.editingItem = null;
        this.editingItemQuantity = false;
        this.editingItemComment = false;
        this.editingItemDiscount = false;
        this.editingItemPrice = false;
        this.editingItemQuantity = false;
        this.editingSaleDiscount = false
    }


    // Item comment

    doEditItemComment(localItemVariantSale:LocalItemVariantSale) {
        this.cancelEdits();
        this.editingItem = localItemVariantSale;
        this.editingItemComment = true;
        if (this.editingItem.comment[this.locale] == null) {
            this.editingItem.comment[this.locale] = '';
        }
        this.editingValue = localItemVariantSale.comment[this.locale];
    }

    onItemCommentChange(event) {
        var commentTexts = this.editingItem.comment;
        commentTexts[this.locale] = event;
        var item = this.editingItem;
        this.itemVariantSaleService.save(item)
            .then(()=> {
                this.itemVariantSaleService.refresh(item);
                this.saleService.refresh(this.sale);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.cancelEdits();
    }

    hasComment(localItemVariantSale:LocalItemVariantSale) {
        if (localItemVariantSale.comment == null) {
            return false;
        }
        var text = localItemVariantSale.comment[this.locale];
        if (text != null && text.trim().length > 0) {
            return true;
        }
        return false;
    }

    // Item discount

    doEditItemDiscount(localItemVariantSale:LocalItemVariantSale) {
        this.cancelEdits();
        this.editingValue = localItemVariantSale.discountRatio;
        this.editingItem = localItemVariantSale;
        this.editingItemDiscount = true;
    }

    onItemDiscountChange(newValue) {
        var discountPercentage = parseInt(newValue);
        if (isNaN(discountPercentage)) {
            discountPercentage = 0;
        }
        var discountRatio = NumberUtils.toFixedDecimals(discountPercentage / 100, 2);
        var item = this.editingItem;
        item.discountRatio = discountRatio;
        this.itemVariantSaleService.save(item)
            .then(()=> {
                this.itemVariantSaleService.refresh(item);
                this.saleService.refresh(this.sale);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.cancelEdits();
    }

    // Item quantity

    doEditItemQuantity(localItemVariantSale:LocalItemVariantSale) {
        this.cancelEdits();
        this.editingValue = localItemVariantSale.quantity;
        this.editingItem = localItemVariantSale;
        this.editingItemQuantity = true;
    }


    onItemQuantityChange(newValue) {
        var quantity = parseInt(newValue);
        if (isNaN(quantity)) {
            quantity = 1;
        } else if (quantity < 1) {
            quantity = 1;
        }
        var item = this.editingItem;
        item.quantity = quantity;
        this.itemVariantSaleService.save(item)
            .then(()=> {
                this.itemVariantSaleService.refresh(item);
                this.saleService.refresh(this.sale);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.cancelEdits();
    }

    // Item price

    doEditItemPrice(localItemVariantSale:LocalItemVariantSale) {
        this.cancelEdits();
        this.editingValue = localItemVariantSale.vatExclusive;
        this.editingItem = localItemVariantSale;
        this.editingItemPrice = true;
    }


    onItemPriceChange(newValue) {
        var price = parseFloat(newValue);
        if (isNaN(price)) {
            price = this.editingItem.itemVariant.calcPrice();
        }
        var vatExclusive = NumberUtils.toFixedDecimals(price, 2);
        var item = this.editingItem;
        item.vatExclusive = vatExclusive;
        this.itemVariantSaleService.save(item)
            .then(()=> {
                this.itemVariantSaleService.refresh(item);
                this.saleService.refresh(this.sale);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.cancelEdits();
    }

    // Sale discount

    doEditSaleDiscount() {
        this.cancelEdits();
        this.editingSaleDiscount = true;
        this.editingValue = this.sale.discountRatio * 100;
    }


    onSaleDiscountChange(newValue:string) {
        var discountPercentage = parseInt(newValue);
        if (isNaN(discountPercentage)) {
            discountPercentage = null;
        }
        if (discountPercentage != null) {
            var discountRatio = NumberUtils.toFixedDecimals(discountPercentage / 100, 2);
            this.sale.discountRatio = discountRatio;
        } else {
            this.sale.discountRatio = null;
        }
        this.saleService.save(this.sale)
            .then(()=> {
                this.saleService.refresh(this.sale);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.cancelEdits();
    }

    doValidateInput(container) {
        var input = this.doFindInput(container);
        if (input == null) {
            return;
        }
        input.dispatchEvent(FastInput.VALIDATE_EVENT);
    }

    doCancelInput(container) {
        var input = this.doFindInput(container);
        if (input == null) {
            return;
        }
        input.dispatchEvent(FastInput.CANCEL_EVENT);
    }

    doFindInput(container:HTMLElement) {
        var inputList = container.getElementsByTagName("input");
        if (inputList.length > 0) {
            return inputList[0];
        }
    }

}