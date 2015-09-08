/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, EventEmitter, FORM_DIRECTIVES} from 'angular2/angular2';

import {CompanyRef} from 'client/domain/company';
import {SaleRef} from 'client/domain/sale';
import {ItemVariantSaleSearch} from 'client/domain/itemVariantSale';

import {LocalSale} from 'client/localDomain/sale';
import {LocalItemVariantSale} from 'client/localDomain/itemVariantSale';

import {LocaleTexts, Language} from 'client/utils/lang';
import {NumberUtils} from 'client/utils/number';
import {SearchRequest, SearchResult} from 'client/utils/search';

import {SaleService} from 'services/sale';
import {ItemVariantSaleService} from 'services/itemVariantSale';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';

import {AutoFocusDirective} from 'directives/autoFocus';
import {FastInput} from 'directives/fastInput';
import {LangSelect, LocalizedDirective} from 'components/utils/langSelect/langSelect';


// The component
@Component({
    selector: 'commandView',
    events: ['validate', 'saleInvalidated'],
    properties: ['salePorp: sale', 'validated', 'noInput']
})

@View({
    templateUrl: './components/sales/sale/commandView/commandView.html',
    styleUrls: ['./components/sales/sale/commandView/commandView.css'],
    directives: [AutoFocusDirective, LocalizedDirective, FastInput, NgFor, NgIf, FORM_DIRECTIVES]
})

export class CommandView {
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
    saleInvalidated = new EventEmitter();

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
    }

    set saleProp(value:LocalSale) {
        this.sale = value;
        var search = this.saleItemsRequest.search;
        search.saleRef = new SaleRef(value.id);
        this.searchItems();
    }

    searchItems() {
        this.itemVariantSaleService.search(this.saleItemsRequest)
            .then((result)=> {
                this.saleItemsResult = result;
            }).catch((error)=> {
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
        var localSale = localItemVariantSale.sale;

        this.itemVariantSaleService.remove(localItemVariantSale)
            .then(()=> {
                this.searchItems();
                this.saleService.refresh(this.sale);
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