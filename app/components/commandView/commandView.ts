/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgFor, NgIf, EventEmitter} from 'angular2/angular2';
import {CommandService, CommandItem} from 'services/commandService';
import {Item} from 'services/itemService';
import {AutoFocusDirective} from 'directives/autoFocus';

// TODO: use angular2 form model & validators
class ToAddItem {
    name: string = null;
    amount: number = 1;
    price: number = null;
}



// The component
@Component({
    selector: 'commandView',
    events: ['validate'],
    properties: ['validated']
})

@View({
    templateUrl: './components/commandView/commandView.html',
    styleUrls: ['./components/commandView/commandView.css'],
    directives: [NgFor, NgIf, AutoFocusDirective]
})

export class CommandView {

    commandService: CommandService;
    toAddItem: ToAddItem;
    toAddReductionItem: CommandItem;
    editingGlobalReduction: boolean = false;
    validate = new EventEmitter();
    validated: boolean = false;

    constructor(commandService: CommandService) {
        this.commandService = commandService;
        this.renewToAddCustomItem();
        this.toAddReductionItem = null;
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

    doAddCustomItem() {
        var item = new Item(undefined);
        item.currentPrice = this.toAddItem.price;
        item.name  = this.toAddItem.name;
        item.reference = null;
        var commandItem = new CommandItem(item);
        commandItem.amount = this.toAddItem.amount;
        this.commandService.addCommandItem(commandItem);
        this.renewToAddCustomItem();
    }
    doStartItemReduction(commandItem: CommandItem) {
        this.toAddReductionItem = commandItem;
    }
    applyItemReduction(event) {
        if (event.which == 13) { // Enter
            var reduction: number = event.target.value;
            this.toAddReductionItem.reduction = reduction;
            this.commandService.calcItemPrice(this.toAddReductionItem);
            this.commandService.calcTotalPrice();
            this.toAddReductionItem = null;
            return;
        }
        if (event.which == 27) { // Escape
            this.toAddReductionItem = null;
            return;
        }
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
            this.editingGlobalReduction = false;
            return;
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