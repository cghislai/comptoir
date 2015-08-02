/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../../typings/_custom.d.ts" />
import {Component, View, NgFor, NgIf, EventEmitter} from 'angular2/angular2';
import {CommandService, CommandItem} from 'services/commandService';
import {Item} from 'services/itemService';
import {AutoFocusDirective} from 'directives/autoFocus';
import {ApplicationService, LocalizedString} from 'services/applicationService';

// TODO: use angular2 form model & validators
class ToAddItem {
    name: string = null;
    amount: number = 1;
    price: number = null;
}



// The component
@Component({
    selector: 'commandView',
    events: ['validate']
})

@View({
    templateUrl: './components/sell/commandView/commandView.html',
    styleUrls: ['./components/sell/commandView/commandView.css'],
    directives: [NgFor, NgIf, AutoFocusDirective]
})

export class CommandView {

    commandService: CommandService;
    applicationService: ApplicationService;
    toAddItem: ToAddItem;
    editingReductionItem: CommandItem = null;
    editingAmountItem: CommandItem = null;
    editingGlobalReduction: boolean = false;
    validate = new EventEmitter();
    validated: boolean = false;

    constructor(commandService: CommandService, applicationService: ApplicationService) {
        this.commandService = commandService;
        this.applicationService = applicationService;
        this.renewToAddCustomItem();
    }

    renewToAddCustomItem() {
        this.toAddItem = new ToAddItem();
    }


    doClearCommand() {
        this.commandService.items = [];
        this.commandService.globalReduction = null;
        this.commandService.calcTotalPrice();
    }
    doClearItem(commandItem: CommandItem) {
        this.commandService.removeCommandItem(commandItem);
    }

    doAddItem(item: Item) {
        var commandIitem = this.commandService.addItem(item);
        // If added a new item, allow to edit quantity directly
        if (commandIitem.amount > 1) {
            this.editingAmountItem = null;
        } else {
            this.editingAmountItem = commandIitem;
        }
    }

    doAddCustomItem() {
        var item = new Item();
        var lang = this.applicationService.language;
        item.currentPrice = this.toAddItem.price;
        item.name  = new LocalizedString(lang, this.toAddItem.name);
        item.reference = null;
        var commandItem = new CommandItem(item);
        commandItem.amount = this.toAddItem.amount;
        this.commandService.addCommandItem(commandItem);
        this.renewToAddCustomItem();
    }
    doEditItemReduction(commandItem: CommandItem) {
        this.editingReductionItem = commandItem;
    }

    applyItemReduction(event) {
        if (event.which == 13) { // Enter
            var reduction: number = event.target.value;
            this.editingReductionItem.reduction = reduction;
            this.commandService.calcItemPrice(this.editingReductionItem);
            this.commandService.calcTotalPrice();
            this.editingReductionItem = null;
            return;
        }
        if (event.which == 27) { // Escape
            this.doCancelItemReduction();
            return;
        }
    }
    doCancelItemReduction() {
        this.editingReductionItem = null;
    }
    doEditItemAmount(commandItem: CommandItem) {
        this.editingAmountItem = commandItem;
    }
    applyItemAmount(event) {
        if (event.which == 13) { // Enter
            var amount: number = event.target.value;
            this.editingAmountItem.amount = amount;
            this.commandService.calcItemPrice(this.editingAmountItem);
            this.commandService.calcTotalPrice();
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
            var reduction: number = event.target.value;
            this.commandService.globalReduction = reduction;
            this.commandService.calcTotalPrice();
            this.editingGlobalReduction = false;
            return;
        }
        if (event.which == 27) { // Escape
            this.cancelGlobalReduction();
            return;
        }
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
    setToAddItemAmount(amount: string) {
        this.toAddItem.amount = parseInt(amount);
    }
    setToAddItemPrice(price: string) {
        this.toAddItem.price = parseFloat(price);
    }
    isItemToAddValid() {
        if (this.toAddItem.name == null
        || this.toAddItem.name.length <= 0) {
            return false;
        }
        if (this.toAddItem.amount == null
        || this.toAddItem.amount <= 0) {
            return false;
        }
        if (this.toAddItem.price == null
        || this.toAddItem.price < 0.01) {
            return false
        }
        return true;
    }

}