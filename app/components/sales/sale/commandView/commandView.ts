/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, EventEmitter, OnInit, FORM_DIRECTIVES, ChangeDetectionStrategy} from 'angular2/angular2';

import {CompanyRef} from 'client/domain/company';
import {SaleRef} from 'client/domain/sale';
import {ItemVariantSaleSearch} from 'client/domain/itemVariantSale';

import {LocalSale} from 'client/localDomain/sale';
import {LocalItemVariant} from 'client/localDomain/itemVariant';
import {LocalItemVariantSale} from 'client/localDomain/itemVariantSale';

import {LocaleTexts, Language} from 'client/utils/lang';
import {NumberUtils} from 'client/utils/number';
import {SearchRequest, SearchResult} from 'client/utils/search';

import {ActiveSaleService} from 'routes/sales/sale/activeSale';
import {SaleService} from 'services/sale';
import {ItemVariantSaleService} from 'services/itemVariantSale';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';

import {AutoFocusDirective} from 'components/utils/autoFocus';
import {FastInput} from 'components/utils/fastInput';
import {LangSelect} from 'components/lang/langSelect/langSelect';
import {LocalizedDirective} from 'components/utils/localizedInput'


@Component({
    selector: 'commandViewHeader',
    properties: ['noInput', 'validated'],
    events: ['validateChanged'],
    changeDetection: ChangeDetectionStrategy.Default
})
@View({
    templateUrl: './components/sales/sale/commandView/header.html',
    styleUrls: ['./components/sales/sale/commandView/commandView.css'],
    directives: [FastInput, NgIf, FORM_DIRECTIVES]
})
export class CommandViewHeader {
    activeSaleService:ActiveSaleService;
    errorService:ErrorService;

    editingSaleDiscount:boolean = false;
    validated:boolean = false;
    validateChanged = new EventEmitter();

    constructor(saleService:ActiveSaleService,
                errorService:ErrorService) {
        this.activeSaleService = saleService;
        this.errorService = errorService;
    }

    get isNewSale():boolean {
        var sale = this.activeSaleService.sale;
        return sale != null && sale.id == null;
    }

    get sale():LocalSale {
        return this.activeSaleService.sale;
    }

    get isSearching():boolean {
        var request = this.activeSaleService.saleItemsRequest;
        return request != null && request.request != null;
    }

    get hasItems():boolean {
        var result = this.activeSaleService.saleItemsResult;
        return result != null && result.count > 0;
    }

    doEditSaleDiscount() {
        this.editingSaleDiscount = true;
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

    onSaleDiscountChange(newValue:string) {
        this.editingSaleDiscount = false;

        var discountPercentage = parseInt(newValue);
        if (isNaN(discountPercentage)) {
            discountPercentage = null;
        }
        var sale = this.activeSaleService.sale;
        if (discountPercentage != null) {
            var discountRatio = NumberUtils.toFixedDecimals(discountPercentage / 100, 2);
            sale.discountRatio = discountRatio;
        } else {
            sale.discountRatio = null;
        }
        this.activeSaleService.doUpdateSale()
            .then(()=> {
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    doValidate() {
        this.validateChanged.next(true);
    }

    doUnvalidate() {
        this.validateChanged.next(false);
    }
}


@Component({
    selector: 'commandViewTable',
    properties: ['noInput', 'validated', 'items'],
    events: ['itemRemoved'],
    changeDetection: ChangeDetectionStrategy.Default
})
@View({
    templateUrl: './components/sales/sale/commandView/table.html',
    styleUrls: ['./components/sales/sale/commandView/commandView.css'],
    directives: [FastInput, NgIf, NgFor, FORM_DIRECTIVES]
})
export class CommandViewTable {
    activeSaleService:ActiveSaleService;
    errorService:ErrorService;

    items:LocalItemVariant[];
    validated:boolean;
    noInput:boolean;
    itemRemoved = new EventEmitter();
    locale:string;

    editingItem:LocalItemVariantSale;
    editingComment:boolean = false;
    editingQuantity:boolean = false;
    editingPrice:boolean = false;
    editingDiscount:boolean = false;

    constructor(saleService:ActiveSaleService,
                authService:AuthService,
                errorService:ErrorService) {
        this.activeSaleService = saleService;
        this.errorService = errorService;
        this.locale = authService.getEmployeeLanguage().locale;
    }

    cancelEdits() {
        if (this.editingItem)
            this.editingItem = null;
        if (this.editingComment)
            this.editingComment = false;
        if (this.editingPrice)
            this.editingPrice = false;
        if (this.editingQuantity)
            this.editingQuantity = false;
        if (this.editingDiscount)
            this.editingDiscount = false;
    }

    isEditing() {
        return this.editingItem != null;
    }

    isEditingItem(item:LocalItemVariantSale) {
        return item == this.editingItem;
    }

    isEditingDiscount(item) {
        return this.isEditingItem(item) && this.editingDiscount;
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


    doEditItemComment(localItemVariantSale:LocalItemVariantSale) {
        this.cancelEdits();
        this.editingItem = localItemVariantSale;
        this.editingComment = true;
        if (this.editingItem.comment[this.locale] == null) {
            this.editingItem.comment[this.locale] = '';
        }
    }

    onItemCommentChange(event) {
        var commentTexts = this.editingItem.comment;
        if (commentTexts[this.locale] == event) {
            this.cancelEdits();
            return;
        }
        commentTexts[this.locale] = event;
        var item = this.editingItem;
        this.activeSaleService.doUpdateItem(item)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.cancelEdits();
    }

    doEditItemQuantity(localItemVariantSale:LocalItemVariantSale) {
        this.cancelEdits();
        this.editingItem = localItemVariantSale;
        this.editingQuantity = true;
    }


    onItemQuantityChange(newValue) {
        var quantity = parseInt(newValue);
        if (isNaN(quantity)) {
            quantity = 1;
        } else if (quantity < 1) {
            quantity = 1;
        }
        if (this.editingItem.quantity == quantity) {
            this.cancelEdits();
            return;
        }
        var item = this.editingItem;
        item.quantity = quantity;
        this.activeSaleService.doUpdateItem(item)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.cancelEdits();
    }


    doEditItemPrice(localItemVariantSale:LocalItemVariantSale) {
        this.cancelEdits();
        this.editingItem = localItemVariantSale;
        this.editingPrice = true;
    }


    onItemPriceChange(newValue) {
        var price = parseFloat(newValue);
        if (isNaN(price)) {
            this.cancelEdits();
            return;
        }
        var vatExclusive = NumberUtils.toFixedDecimals(price / ( 1 + this.editingItem.vatRate), 2);
        var item = this.editingItem;
        if (item.vatExclusive == vatExclusive) {
            this.cancelEdits();
            return;
        }
        item.vatExclusive = vatExclusive;
        this.activeSaleService.doUpdateItem(item)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.cancelEdits();
    }

    doEditItemDiscount(localItemVariantSale:LocalItemVariantSale) {
        this.cancelEdits();
        this.editingItem = localItemVariantSale;
        this.editingDiscount = true;
    }

    onItemDiscountChange(newValue) {
        var discountPercentage = parseInt(newValue);
        if (isNaN(discountPercentage)) {
            discountPercentage = 0;
        }
        var discountRatio = NumberUtils.toFixedDecimals(discountPercentage / 100, 2);
        var item = this.editingItem;
        if (item.discountRatio == discountRatio) {
            this.cancelEdits();
            return;
        }
        item.discountRatio = discountRatio;
        this.activeSaleService.doUpdateItem(item)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.cancelEdits();
    }


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

    calcTotalVatInclusive(item: LocalItemVariantSale) {
        var price = item.total;
        var vat = item.itemVariant.item.vatRate;
        price *= (1 + vat);
        return price;
    }

    calcPriceVatInclusive(item: LocalItemVariantSale) {
        var price = item.itemVariant.calcPrice(true);
        return price;
    }

    doRemoveItem(localItemVariantSale:LocalItemVariantSale) {
        this.activeSaleService.doRemoveItem(localItemVariantSale)
            .then(()=> {
                this.itemRemoved.next(null);
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

}

// The component
@Component({
    selector: 'commandView',
    events: ['saleEmptied'],
    properties: ['noInput'],
    changeDetection: ChangeDetectionStrategy.Default
})

@View({
    templateUrl: './components/sales/sale/commandView/commandView.html',
    styleUrls: ['./components/sales/sale/commandView/commandView.css'],
    directives: [CommandViewHeader, CommandViewTable,
        NgIf, FORM_DIRECTIVES]
})

export class CommandView {
    activeSaleService:ActiveSaleService;
    errorService:ErrorService;

    validated:boolean = false;
    saleEmptied = new EventEmitter();
    observableItems: any;

    constructor(saleService:ActiveSaleService,
                errorService:ErrorService) {
        this.activeSaleService = saleService;
        this.errorService = errorService;
        this.validated = this.activeSaleService.payStep;
    }

    onValidateChanged(validated) {
        this.validated = validated;
        this.activeSaleService.payStep = validated;
    }

    onItemRemoved() {
        var searchResult = this.activeSaleService.saleItemsResult;
        if (searchResult.list.length == 0) {
            this.saleEmptied.next(null);
        }
    }



}