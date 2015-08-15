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
    editingReductionItem:ASaleItem = null;
    editingAmountItem:ASaleItem = null;
    editingGlobalReduction:boolean = false;
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

    doEditItemReduction(activeItem:ASaleItem) {
        this.editingReductionItem = activeItem;
    }

    onEditItemReductionKeyUp(event) {
        if (event.which == 13) { // Enter
            var reduction:number = event.target.value;
            this.doApplyItemReduction(reduction);
            return;
        }
        if (event.which == 27) { // Escape
            this.doCancelItemReduction();
            return;
        }
    }

    doApplyItemReduction(reduction:number) {
        this.editingReductionItem.reduction = reduction;
        // TODO: handle eeduction in backend
        this.editingReductionItem = null;
    }

    doCancelItemReduction() {
        this.editingReductionItem = null;
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

    onGlobalReductionKeyEvent(event) {
        if (event.which == 13) { // Enter
            var reduction:string = event.target.value;
            var reductionVal = parseFloat(reduction);
            if (isNaN(reductionVal)) {
                return false;
            }
            this.applyGlobalReduction(reductionVal);
            return false;
        }
        if (event.which == 27) { // Escape
            this.cancelGlobalReduction();
            return false;
        }
        return false;
    }

    applyGlobalReduction(reduction:number) {
        this.aSale.reduction = reduction;
        // TODO: handle reduction in backend
        this.editingGlobalReduction = false;
    }

    cancelGlobalReduction() {
        this.editingGlobalReduction = false;
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