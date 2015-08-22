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
import {ApplicationService} from 'services/application';


// The component
@Component({
    selector: 'commandView',
    events: ['validate', 'saleInvalidated'],
    properties: ['aSale: sale', 'validated']
})

@View({
    templateUrl: './components/sales/sale/commandView/commandView.html',
    styleUrls: ['./components/sales/sale/commandView/commandView.css'],
    directives: [AutoFocusDirective, NgFor, NgIf, formDirectives]
})

export class CommandView {
    saleService:SaleService;

    aSale:ASale;
    language:string;

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
        this.language = applicationService.language.locale;
    }

    doRemoveItem(saleItem:ASaleItem) {
        var aSale = saleItem.aSale;
        var saleToBeRemoved = aSale.items.length == 1;

        this.saleService.removeASaleItem(saleItem)
            .then(()=> {
                if (saleToBeRemoved) {
                    this.saleInvalidated.next(null);
                }
            });
    }

    // Item edit

    canceEdits() {
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
        this.canceEdits();
        this.editingItem = aSaleItem;
        this.editingItemComment = true;
    }

    onItemCommentKeyEvent(event) {
        if (event.which == 13) { // Enter
            this.onItemCommentChanged(event);
            this.applyItemComment();
            return false;
        }
        if (event.which == 27) { // Escape
            this.cancelItemComment();
            return false;
        }
        return false;
    }

    onItemCommentChanged(event) {
        var commentString:string = event.target.value;
        this.editingItem.comment = new LocaleTexts();
        this.editingItem.comment[this.language] = commentString;
    }

    applyItemComment() {
        this.saleService.setASaleItemComment(
            this.editingItem,
            this.editingItem.comment);
        this.canceEdits();
    }

    cancelItemComment() {
        var oldComment = this.editingItem.itemSale.comment;
        if (oldComment == null) {
            this.editingItem.comment = oldComment;
        }
        this.editingItem.comment = new LocaleTexts();
        this.canceEdits();
    }

    hasComment(saleItem:ASaleItem) {
        if (saleItem.comment == null) {
            return false;
        }
        var text = saleItem.comment[this.language];
        if (text != null && text.length > 0) {
            return true;
        }
        return false;
    }

    // Item discount

    doEditItemDiscount(aSaleItem:ASaleItem) {
        this.canceEdits();
        this.editingItem = aSaleItem;
        this.editingItemDiscount = true;
    }

    onItemDiscountKeyEvent(event) {
        if (event.which == 13) { // Enter
            this.onItemDiscountChanged(event);
            this.applyItemDiscount();
            return false;
        }
        if (event.which == 27) { // Escape
            this.cancelItemDiscount();
            return false;
        }
        return false;
    }

    onItemDiscountChanged(event) {
        var discountString:string = event.target.value;
        var discountPercentage = parseInt(discountString);
        if (isNaN(discountPercentage)) {
            this.editingItem.discountPercentage = null;
            return false;
        }
        this.editingItem.discountPercentage = discountPercentage;
    }

    applyItemDiscount() {
        this.saleService.setASaleItemDiscountPercentage(
            this.editingItem,
            this.editingItem.discountPercentage);
        this.canceEdits();
    }

    cancelItemDiscount() {
        var oldDiscount = this.editingItem.itemSale.discountRatio;
        if (oldDiscount == null) {
            this.editingItem.discountPercentage = null;
        }
        this.editingItem.discountPercentage = oldDiscount * 100;
        this.canceEdits();
    }


    // Item quantity

    doEditItemQuantity(aSaleItem:ASaleItem) {
        this.canceEdits();
        this.editingItem = aSaleItem;
        this.editingItemQuantity = true;
    }

    onItemQuantityKeyEvent(event) {
        if (event.which == 13) { // Enter
            this.onItemQuantityChanged(event);
            this.applyItemQuantity();
            return false;
        }
        if (event.which == 27) { // Escape
            this.cancelItemQuantity();
            return false;
        }
        return false;
    }

    onItemQuantityChanged(event) {
        var quantityString:string = event.target.value;
        var quantity = parseInt(quantityString);
        if (isNaN(quantity)) {
            this.editingItem.quantity = null;
            return false;
        }
        this.editingItem.quantity = quantity;
    }

    applyItemQuantity() {
        this.saleService.setASaleItemQuantity(
            this.editingItem,
            this.editingItem.quantity);
        this.canceEdits();
    }

    cancelItemQuantity() {
        var oldQuantity = this.editingItem.itemSale.quantity;
        if (oldQuantity == null) {
            this.editingItem.quantity = null;
        }
        this.editingItem.quantity = oldQuantity;
        this.canceEdits();
    }

    // Item price

    doEditItemPrice(aSaleItem:ASaleItem) {
        this.canceEdits();
        this.editingItem = aSaleItem;
        this.editingItemPrice = true;
    }

    onItemPriceKeyEvent(event) {
        if (event.which == 13) { // Enter
            this.onItemPriceChanged(event);
            this.applyItemPrice();
            return false;
        }
        if (event.which == 27) { // Escape
            this.cancelItemPrice();
            return false;
        }
        return false;
    }

    onItemPriceChanged(event) {
        var priceString:string = event.target.value;
        var price = parseFloat(priceString);
        if (isNaN(price)) {
            this.editingItem.vatExclusive = null;
            return false;
        }
        var vatExclusive = NumberUtils.toFixedDecimals(price, 2);
        this.editingItem.vatExclusive = vatExclusive;
    }

    applyItemPrice() {
        this.saleService.setASaleItemVatExclusive(
            this.editingItem,
            this.editingItem.vatExclusive);
        this.canceEdits();
    }

    cancelItemPrice() {
        var oldPrice = this.editingItem.itemSale.vatExclusive;
        if (oldPrice == null) {
            this.editingItem.vatExclusive = null;
        }
        this.editingItem.vatExclusive = oldPrice;
        this.canceEdits();
    }


    // Item discount

    doEditSaleDiscount() {
        this.canceEdits();
        this.editingSaleDiscount = true;
    }

    onSaleDiscountKeyEvent(event) {
        if (event.which == 13) { // Enter
            this.onSaleDiscountChanged(event);
            this.applySaleDiscount();
            return false;
        }
        if (event.which == 27) { // Escape
            this.cancelSaleDiscount();
            return false;
        }
        return false;
    }

    onSaleDiscountChanged(event) {
        var discountString:string = event.target.value;
        var discountPercentage = parseInt(discountString);
        if (isNaN(discountPercentage)) {
            this.aSale.discountPercentage = null;
            return false;
        }
        this.aSale.discountPercentage = discountPercentage;
    }

    applySaleDiscount() {
        this.saleService.setASaleDiscountPercentage(
            this.aSale,
            this.aSale.discountPercentage);
        this.canceEdits();
    }

    cancelSaleDiscount() {
        var oldDiscount = this.aSale.sale.discountRatio;
        if (oldDiscount == null) {
            this.aSale.discountPercentage = null;
        }
        this.aSale.discountPercentage = oldDiscount * 100;
        this.canceEdits();
    }

    doValidateItemEdit() {
        if (this.editingItemComment) {
            this.applyItemComment();
        }
        if (this.editingItemDiscount) {
            this.applyItemDiscount();
        }
        if (this.editingItemPrice) {
            this.applyItemPrice();
        }
        if (this.editingItemQuantity) {
            this.applyItemQuantity();
        }
    }


    doValidate() {
        this.validated = true;
        this.validate.next(this.validated);
    }

    doUnvalidate() {
        this.validated = false;
        this.validate.next(this.validated);
    }

}