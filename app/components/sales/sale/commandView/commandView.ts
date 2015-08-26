/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, EventEmitter, formDirectives} from 'angular2/angular2';

import {Item} from 'client/domain/item';
import {Sale, SaleRef} from 'client/domain/sale';
import {ItemSale, ItemSaleSearch} from 'client/domain/itemSale';

import {LocaleTexts} from 'client/utils/lang';
import {ASale, ASaleItem} from 'client/utils/aSale';
import {NumberUtils} from 'client/utils/number';

import {SaleService} from 'services/sale';

import {AutoFocusDirective} from 'directives/autoFocus';
import {FastInput} from 'directives/fastInput';
import {ApplicationService} from 'services/application';


// The component
@Component({
    selector: 'commandView',
    events: ['validate', 'saleInvalidated'],
    properties: ['aSale: sale', 'validated', 'noInput']
})

@View({
    templateUrl: './components/sales/sale/commandView/commandView.html',
    styleUrls: ['./components/sales/sale/commandView/commandView.css'],
    directives: [AutoFocusDirective, FastInput, NgFor, NgIf, formDirectives]
})

export class CommandView {
    saleService:SaleService;
    appService:ApplicationService;

    aSale:ASale;
    language:string;
    noInput: boolean;

    editingItem:ASaleItem = null;
    editingItemQuantity:boolean;
    editingItemPrice:boolean;
    editingItemComment:boolean;
    editingItemDiscount:boolean;

    editingSaleDiscount:boolean = false;
    validate = new EventEmitter();
    validated:boolean = false;
    saleInvalidated = new EventEmitter();

    constructor(saleService:SaleService,
                applicationService:ApplicationService) {
        this.saleService = saleService;
        this.appService = applicationService;
        this.language = applicationService.language.locale;
    }

    doRemoveItem(saleItem:ASaleItem) {
        var aSale = saleItem.aSale;
        var saleToBeRemoved = aSale.items.length == 1;

        this.saleService.removeASaleItemAsync(saleItem)
            .then(()=> {
                if (saleToBeRemoved) {
                    this.saleInvalidated.next(null);
                }
            }).catch((error)=> {
                this.appService.handleRequestError(error);
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

    doEditItemComment(aSaleItem:ASaleItem) {
        this.cancelEdits();
        this.editingItem = aSaleItem;
        this.editingItemComment = true;
        if (this.editingItem.comment[this.language] == null) {
            this.editingItem.comment[this.language] = '';
        }
    }

    onItemCommentChange(event) {
        var commentTexts = this.editingItem.comment;
        commentTexts[this.language] = event;
        this.saleService.setASaleItemCommentAsync(
            this.editingItem, commentTexts)
            .catch((error)=> {
                this.appService.handleRequestError(error);
            });
        this.cancelEdits();
    }

    hasComment(saleItem:ASaleItem) {
        if (saleItem.comment == null) {
            return false;
        }
        var text = saleItem.comment[this.language];
        if (text != null && text.trim().length > 0) {
            return true;
        }
        return false;
    }

    // Item discount

    doEditItemDiscount(aSaleItem:ASaleItem) {
        this.cancelEdits();
        this.editingItem = aSaleItem;
        this.editingItemDiscount = true;
    }

    onItemDiscountChange(newValue) {
        var discountPercentage = parseInt(newValue);
        if (isNaN(discountPercentage)) {
            discountPercentage = 0;
        }
        this.saleService.setASaleItemDiscountPercentageAsync(
            this.editingItem, discountPercentage)
            .catch((error)=> {
                this.appService.handleRequestError(error);
            });
        this.cancelEdits();
    }

    // Item quantity

    doEditItemQuantity(aSaleItem:ASaleItem) {
        this.cancelEdits();
        this.editingItem = aSaleItem;
        this.editingItemQuantity = true;
    }


    onItemQuantityChange(newValue) {
        var quantity = parseInt(newValue);
        if (isNaN(quantity)) {
            quantity = 1;
        } else if (quantity < 1) {
            quantity = 1;
        }
        this.saleService.setASaleItemQuantityAsync(
            this.editingItem, quantity).catch((error)=> {
                this.appService.handleRequestError(error);
            });
        this.cancelEdits();
    }

    // Item price

    doEditItemPrice(aSaleItem:ASaleItem) {
        this.cancelEdits();
        this.editingItem = aSaleItem;
        this.editingItemPrice = true;
    }


    onItemPriceChange(newValue) {
        var price = parseFloat(newValue);
        if (isNaN(price)) {
            price = this.editingItem.item.vatExclusive;
        }
        var vatExclusive = NumberUtils.toFixedDecimals(price, 2);
        this.saleService.setASaleItemVatExclusiveAsync(
            this.editingItem, vatExclusive)
            .catch((error)=> {
                this.appService.handleRequestError(error);
            });
        this.cancelEdits();
    }

    // Sale discount

    doEditSaleDiscount() {
        this.cancelEdits();
        this.editingSaleDiscount = true;
    }


    onSaleDiscountChange(newValue:string) {
        var intValue = parseInt(newValue);
        if (isNaN(intValue)) {
            intValue = 0;
        }
        this.saleService.setASaleDiscountPercentage(
            this.aSale, intValue)
            .catch((error)=> {
                this.appService.handleRequestError(error);
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

    doFindInput(container: HTMLElement) {
        var inputList = container.getElementsByTagName("input");
        if (inputList.length > 0) {
            return inputList[0];
        }
    }

}