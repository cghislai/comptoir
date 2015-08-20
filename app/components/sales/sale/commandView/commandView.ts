/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, EventEmitter, FORM_DIRECTIVES} from 'angular2/angular2';

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
    events: ['validate', 'saleInvalidated'],
    properties: ['aSale: sale', 'validated']
})

@View({
    templateUrl: './components/sales/sale/commandView/commandView.html',
    styleUrls: ['./components/sales/sale/commandView/commandView.css'],
    directives: [AutoFocusDirective, NgFor, NgIf, FORM_DIRECTIVES]
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
    saleInvalidated = new EventEmitter();

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
        var aSale = saleItem.aSale;
        var saleToBeremoved = aSale.items.length == 1;

        this.saleService.removeASaleItem(saleItem)
            .then(()=> {
                if (saleToBeremoved) {
                    this.saleInvalidated.next(null);
                }
            });
    }

    doAddCustomItem() {
        // TODO: create custom
        var item = new Item();
        item.vatExclusive = this.toAddItem.price;
        item.vatRate = this.toAddItem.vat * 0.01;
        item.name = new LocaleTexts();
        item.name[this.language] = this.toAddItem.name;
        item.description = new LocaleTexts();
        item.reference = "CUSTOM";

        this.saleService.addItemToASale(this.aSale, item);
        this.renewToAddCustomItem();
    }

    doEditItemDiscount(aSaleItem:ASaleItem) {
        this.editingDiscountSaleItem = aSaleItem;
    }

    onItemDiscountKeyEvent(event) {
        if (event.which == 13) { // Enter
            this.onItemDiscountPercentageChanged(event);
            this.applyItemDicountPercentage();
            return false;
        }
        if (event.which == 27) { // Escape
            this.cancelItemDiscount();
            return false;
        }
        return false;
    }

    onItemDiscountPercentageChanged(event) {
        var discountString:string = event.target.value;
        var discountPercentage = parseFloat(discountString);
        if (isNaN(discountPercentage)) {
            this.editingDiscountSaleItem.discountPercentage = null;
            return false;
        }
        this.editingDiscountSaleItem.discountPercentage = discountPercentage;
    }

    applyItemDicountPercentage() {
        var discountRatio = null;
        if (this.editingDiscountSaleItem.discountPercentage != null) {
            discountRatio =  this.editingDiscountSaleItem.discountPercentage / 100;
        }
        this.editingDiscountSaleItem.discountRate = discountRatio;
        this.editingDiscountSaleItem.itemSale.discountRatio = discountRatio;
        this.saleService
            .updateASaleItem( this.editingDiscountSaleItem)
            .then((aSale)=> {
                // this.aSale == aSale
            });
        this.editingDiscountSaleItem = null;
    }

    cancelItemDiscount() {
        var oldDiscuont = this.editingDiscountSaleItem.itemSale.discountRatio;
        if (oldDiscuont == null) {
            this.editingDiscountSaleItem.discountPercentage = null;
        }
        this.editingDiscountSaleItem.discountPercentage = oldDiscuont * 100;
        this.editingDiscountSaleItem = null;
    }


    doEditItemAmount(activeItem:ASaleItem) {
        this.editingAmountItem = activeItem;
    }

    onItemAmountKeyEvent(event) {
        if (event.which == 13) { // Enter
            this.onItemAmountChanged(event);
            this.applyItemAmount();
            return false;
        }
        if (event.which == 27) { // Escape
            this.cancelItemAmount();
            return false;
        }
        return false;
    }

    onItemAmountChanged(event) {
        var amount:string = event.target.value;
        var amountVal = parseInt(amount);
        if (isNaN(amountVal)) {
            return;
        }
        this.editingAmountItem.quantity = amountVal;
    }

    applyItemAmount() {
        var quantity = this.editingAmountItem.quantity;
        var itemSale = this.editingAmountItem.itemSale;
        itemSale.quantity = quantity;

        this.saleService.updateASaleItem(this.editingAmountItem)
            .then(()=> {
                // all good
            });
        this.editingAmountItem = null;
        return false;
    }


    cancelItemAmount() {
        var oldAmount = this.editingAmountItem.itemSale.quantity;
        this.editingAmountItem.quantity = oldAmount;
        this.editingAmountItem = null;
    }

    onSaleDiscountKeyEvent(event) {
        if (event.which == 13) { // Enter
            this.onSalePercentageChanged(event);
            this.applySaleDicountPercentage();
            return false;
        }
        if (event.which == 27) { // Escape
            this.cancelSaleDiscount();
            return false;
        }
        return false;
    }

    onSalePercentageChanged(event) {
        var discountString:string = event.target.value;
        var discountPercentage = parseFloat(discountString);
        if (isNaN(discountPercentage)) {
            this.aSale.discountPercentage = null;
            return false;
        }
        this.aSale.discountPercentage = discountPercentage;
    }

    applySaleDicountPercentage() {
        var discountRatio = this.aSale.discountPercentage / 100;
        this.saleService
            .setASaleDiscount(this.aSale, discountRatio)
            .then((aSale)=> {
                // this.aSale == aSale
            });
        this.editingSaleDiscount = false;
    }

    cancelSaleDiscount() {
        var sale = this.aSale.sale;
        if (sale == null) {
            this.aSale.discountPercentage = null;
        } else {
            var oldDiscount = sale.discountRatio;
            if (oldDiscount == null) {
                this.aSale.discountPercentage = null;
            } else {
                this.aSale.discountPercentage = oldDiscount * 100;
            }
        }
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


    setToAddItemPrice(event) {
        var price = parseFloat(event.target.value);
        if (this.toAddItem.price == price) {
            return;
        }
        this.toAddItem.price = price;
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