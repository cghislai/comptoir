/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, EventEmitter} from 'angular2/angular2';

import {LocaleText} from 'client/domain/lang';
import {CommandService, CommandItem, Command} from 'services/commandService';
import {Item} from 'services/itemService';
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
    events: ['validate']
})

@View({
    templateUrl: './components/sale/current/commandView/commandView.html',
    styleUrls: ['./components/sale/current/commandView/commandView.css'],
    directives: [NgFor, NgIf, AutoFocusDirective]
})

export class CommandView {
    commandService:CommandService;
    command:Command;
    locale:Locale;

    applicationService:ApplicationService;
    toAddItem:ToAddItem;
    editingReductionItem:CommandItem = null;
    editingAmountItem:CommandItem = null;
    editingGlobalReduction:boolean = false;
    validate = new EventEmitter();
    validated:boolean = false;
    commandNavVisible:boolean = false;

    constructor(commandService:CommandService, applicationService:ApplicationService) {
        this.commandService = commandService;
        this.applicationService = applicationService;
        this.locale = applicationService.locale;
        this.renewToAddCustomItem();
        this.switchToNextCommand();
    }

    renewToAddCustomItem() {
        this.toAddItem = new ToAddItem();
    }

    switchToNextCommand() {
        if (this.command == null) {
            if (this.commandService.activeCommands.length == 0) {
                this.command = this.commandService.newCommand();
                return;
            }
            this.command = this.commandService.activeCommands[0];
            return;
        }
        this.command = this.commandService.nextActive(this.command);
    }

    switchToCommand(command:Command) {
        this.command = command;
        this.command.calcTotalPrice();
    }

    switchToNewCommand() {
        this.command = this.commandService.newCommand();
    }

    cancelCommand() {
        this.commandService.removeActiveCommand(this.command);
        this.command = null;
        this.switchToNextCommand();
    }


    doClearCommand() {
        this.command.reset();
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
        item.currentPrice.vatExclusive = this.toAddItem.price;
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
            var amount:number = event.target.value;
            this.editingAmountItem.amount = amount;
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
            var reduction:number = event.target.value;
            this.command.globalReduction = reduction;
            this.command.calcTotalPrice();
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
        this.closeCommandNav();
    }

    doUnvalidate() {
        this.validated = false;
        this.validate.next(this.validated);
    }

    onCommandPaid() {
        this.commandService.saveCommand(this.command);
        this.command = null;
        this.validated = false;
        this.switchToNextCommand();
    }

    setToAddItemAmount(amount:string) {
        this.toAddItem.amount = parseInt(amount);
    }

    handleToAdditemPriceKeyUp(event) {
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

    switchCommandNavVisibility() {
        if (this.validated) {
            return;
        }
        this.commandNavVisible = !this.commandNavVisible;
    }

    openCommandNav() {
        this.commandNavVisible = true;
    }

    closeCommandNav() {
        this.commandNavVisible = false;
    }
}