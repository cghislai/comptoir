/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, EventEmitter, formDirectives} from 'angular2/angular2';

import {Item} from 'client/domain/item';
import {Sale, SaleRef} from 'client/domain/sale';
import {ItemSale, ItemSaleSearch} from 'client/domain/itemSale';

import {LocaleTexts} from 'client/utils/lang';
import {ASale, ASaleItem} from 'client/utils/aSale';

import {SaleService} from 'services/sale';

import {AutoFocusDirective} from 'directives/autoFocus';
import {ApplicationService} from 'services/application';


// TODO: use angular2 form validators
class ToAddItem {
    name:string = null;
    amount:number = 1;
    price:number = null;
    vat:number = 21.0;
}


// The component
@Component({
    selector: 'commandView',
    events: ['validate'],
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

    toAddItem:ToAddItem;
    editingDiscountSaleItem:ASaleItem = null;
    editingAmountItem:ASaleItem = null;
    editingSaleDiscount:boolean = false;
    validate = new EventEmitter();
    validated:boolean = false;

    constructor(saleService:SaleService,
                applicationService:ApplicationService) {
        this.saleService = saleService;
        this.language = applicationService.language.locale;
        this.renewToAddCustomItem();
    }

    renewToAddCustomItem() {
        this.toAddItem = new ToAddItem();
    }


    doRemoveItem(saleItem:ASaleItem) {
        this.saleService.removeASaleItem(saleItem)
            .then(()=> {
                // all good;
            });
        // TODO: remove items
    }

    doAddCustomItem() {
        // TODO: create custom
        var item = new Item();
        item.vatExclusive = this.toAddItem.price;
        item.vatRate = this.toAddItem.vat * 0.01;
        item.name = new LocaleTexts();
        item.name[this.language] = this.toAddItem.name;
        item.reference = null;
        // TODO: mark item as custom, save, create itemSale, save, add to ActiveSale
        this.renewToAddCustomItem();
    }

    doEditItemDiscount(aSaleItem:ASaleItem) {
        this.editingDiscountSaleItem = aSaleItem;
    }

    onItemDiscountKeyEvent(event) {
        if (event.which == 13) { // Enter
            var discount:number = event.target.value;
            discount /= 100;
            this.applyItemDiscount(discount);
            return;
        }
        if (event.which == 27) { // Escape
            this.doCancelItemDiscount();
            return;
        }
    }

    private applyItemDiscount(discountRatio:number) {
        this.saleService
            .setASaleItemDiscount(this.editingDiscountSaleItem, discountRatio)
            .then(()=>{});
        this.editingDiscountSaleItem = null;
    }

    doCancelItemDiscount() {
        this.editingDiscountSaleItem = null;
    }

    doEditItemAmount(activeItem:ASaleItem) {
        this.editingAmountItem = activeItem;
    }

    onItemAmountKeyEvent(event) {
        if (event.which == 13) { // Enter
            var amount:string = event.target.value;
            var amountVal = parseInt(amount);
            if (isNaN(amountVal)) {
                return false;
            }
            this.applyItemAmount(amountVal);
            return false;
        }
        if (event.which == 27) { // Escape
            this.cancelItemAmount();
            return false;
        }
        return false;
    }

    applyItemAmount(amount:number) {
        var itemSale = this.editingAmountItem.itemSale;
        itemSale.quantity = amount;

        this.saleService.updateASaleItem(this.editingAmountItem)
            .then(()=> {
                // all good
            });
        this.editingAmountItem = null;
        return false;
    }


    cancelItemAmount() {
        this.editingAmountItem = null;
    }

    onSaleDiscountKeyEvent(event) {
        if (event.which == 13) { // Enter
            var discountString:string = event.target.value;
            var discountRatio = parseFloat(discountString);
            if (isNaN(discountRatio)) {
                return false;
            }
            discountRatio /= 100;
            this.applySaleDiscount(discountRatio);
            return false;
        }
        if (event.which == 27) { // Escape
            this.cancelSaleDiscount();
            return false;
        }
        return false;
    }

    private applySaleDiscount(discountRatio:number) {
        this.saleService
            .setASaleDiscount(this.aSale, discountRatio)
            .then((aSale)=> {
                // this.aSale == aSale
            });
        this.editingSaleDiscount = false;
    }

    cancelSaleDiscount() {
        this.editingSaleDiscount = false;
    }

    doValidate() {
        this.validated = true;
        this.validate.next(this.validated);
    }

    doUnvalidate() {
        this.validated = false;
        this.validate.next(this.validated);
    }

    setToAddItemAmount(amount:string) {
        this.toAddItem.amount = parseInt(amount);
    }

    handleToAddItemPriceKeyUp(event) {
        if (event.which == 13) { // Enter
            this.setToAddItemPrice(event);
            return;
        }
        if (event.which == 27) { // Escape
            return;
        }
    }

    setToAddItemPrice(event) {
        var price = parseFloat(event.target.value);
        if (this.toAddItem.price == price) {
            return;
        }
        this.toAddItem.price = price;
    }

    handleToAddItemVatKeyUp(event) {
        if (event.which == 13) { // Enter
            this.setToAddItemVat(event);
            return;
        }
        if (event.which == 27) { // Escape
            return;
        }
    }

    setToAddItemVat(event) {
        var vat = parseFloat(event.target.value);
        if (this.toAddItem.vat == vat) {
            return;
        }
        this.toAddItem.vat = vat;
    }

    isItemToAddValid() {
        if (this.toAddItem.name == null
            || this.toAddItem.name.length <= 0) {
            return false;
        }
        if (this.toAddItem.amount == null
            || isNaN(this.toAddItem.amount)
            || this.toAddItem.amount <= 0) {
            return false;
        }
        if (this.toAddItem.price == null
            || isNaN(this.toAddItem.price)
            || this.toAddItem.price < 0.01) {
            return false
        }
        if (this.toAddItem.vat == null
            || isNaN(this.toAddItem.vat)
            || this.toAddItem.vat < 0.01) {
            return false
        }
        return true;
    }

}