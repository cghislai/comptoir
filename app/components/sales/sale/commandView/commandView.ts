/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, EventEmitter} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {LocaleText} from 'client/domain/lang';
import {SaleService, CommandItem, Command} from 'services/saleService';
import {Item} from 'client/domain/item';
import {AutoFocusDirective} from 'directives/autoFocus';
import {ApplicationService} from 'services/application';
import {Locale} from 'services/utils';


// TODO: use angular2 form validators
class ToAddItem {
    name:string = null;
    amount:number = 1;
    price:number = null;
}


// The component
@Component({
    selector: 'commandView',
    events: ['validate'],
    properties: ['command', 'validated']
})

@View({
    templateUrl: './components/sales/sale/commandView/commandView.html',
    styleUrls: ['./components/sales/sale/commandView/commandView.css'],
    directives: [AutoFocusDirective, NgFor,NgIf]
})

export class CommandView {
    saleService:SaleService;
    command:Command;
    locale:Locale;
    router: Router;

    applicationService:ApplicationService;
    toAddItem:ToAddItem;
    editingReductionItem:CommandItem = null;
    editingAmountItem:CommandItem = null;
    editingGlobalReduction:boolean = false;
    validate = new EventEmitter();
    validated:boolean = false;

    constructor(saleService:SaleService, applicationService:ApplicationService,
                router: Router) {
        this.saleService = saleService;
        this.applicationService = applicationService;
        this.locale = applicationService.locale;
        this.router = router;
        this.renewToAddCustomItem();
    }

    renewToAddCustomItem() {
        this.toAddItem = new ToAddItem();
    }


    doClearItem(commandItem:CommandItem) {
        this.command.removeCommandItem(commandItem);
    }

    doAddItem(item:Item) {
        var commandIitem = this.command.addItem(item);
        // If added a new item, allow to edit quantity directly
        /*   if (commandIitem.amount > 1) {
         this.editingAmountItem = null;
         } else {
         this.editingAmountItem = commandIitem;
         }*/
    }

    doAddCustomItem() {
        var item = new Item();
        var lang = this.applicationService.locale;
        item.vatExclusive = this.toAddItem.price;
        item.name[lang.isoCode] = this.toAddItem.name;
        item.reference = null;
        var commandItem = new CommandItem(item);
        commandItem.amount = this.toAddItem.amount;
        this.command.addCommandItem(commandItem);
        this.renewToAddCustomItem();
    }

    doEditItemReduction(commandItem:CommandItem) {
        this.editingReductionItem = commandItem;
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

    doApplyItemReduction(reduction: number) {
        this.editingReductionItem.reduction = reduction;
        this.command.calcItemPrice(this.editingReductionItem);
        this.command.calcTotalPrice();
        this.editingReductionItem = null;
    }

    doCancelItemReduction() {
        this.editingReductionItem = null;
    }

    doEditItemAmount(commandItem:CommandItem) {
        this.editingAmountItem = commandItem;
    }

    applyItemAmount(event) {
        if (event.which == 13) { // Enter
            var amount:string = event.target.value;
            var amountVal = parseInt(amount);
            if (isNaN(amountVal)) {
                return false;
            }
            this.editingAmountItem.amount = amountVal;
            this.command.calcItemPrice(this.editingAmountItem);
            this.command.calcTotalPrice();
            this.editingAmountItem = null;
            return false;
        }
        if (event.which == 27) { // Escape
            this.cancelItemAmount();
            return false;
        }
        return false;
    }

    cancelItemAmount() {
        this.editingAmountItem = null;
    }

    applyGlobalReduction(event) {
        if (event.which == 13) { // Enter
            var reduction:string= event.target.value;
            var reductionVal = parseFloat(reduction);
            if (isNaN(reductionVal)) {
                this.command.globalReduction = null;
            } else {
                this.command.globalReduction = reductionVal;
            }
            this.command.calcTotalPrice();
            this.editingGlobalReduction = false;
            return false;
        }
        if (event.which == 27) { // Escape
            this.cancelGlobalReduction();
            return false;
        }
        return false;
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
        return true;
    }

}