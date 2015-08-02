/**
 * Created by cghislai on 28/07/15.
 */
import {Item} from 'services/itemService';

export class CommandItem {
    item: Item;
    amount: number;
    reduction: number;
    price: number;

    constructor(item: Item) {
        this.item = item;
        this.amount = 0;
        this.reduction = null;
        this.price = 0;
    }
}

export class Command {
    items: CommandItem[];
    globalReduction: number;
    totalPrice: number;
    id: number;

    constructor() {
        this.items = [];
        this.globalReduction = null;
        this.totalPrice = 0;
        this.id = 0;
    }
    reset() {
        this.items = [];
        this.totalPrice = 0;
        this.globalReduction = null;
    }

    addItem(item: Item) {
        var id = item.id;
        var commandItem: CommandItem = this.getCommandItem(item);
        if (commandItem == null) {
            commandItem = new CommandItem(item);
            this.items.push(commandItem);
        }
        commandItem.amount++;
        this.calcItemPrice(commandItem);
        this.calcTotalPrice();
        return commandItem;
    }
    removeItem(item: Item) {
        var oldItems = this.items;
        var newItems:CommandItem[] = [];
        oldItems.forEach(function(commandItem: CommandItem) {
            if (commandItem.item.equals(item)) {
                return;
            }
            newItems.push(commandItem);
        })
        this.items = newItems;
        this.calcTotalPrice();
    }
    addCommandItem(commandItem: CommandItem) {
        this.calcItemPrice(commandItem);
        this.items.push(commandItem);
        this.calcTotalPrice();
    }
    removeCommandItem(commandItem: CommandItem) {
        var oldItems = this.items;
        var newItems:CommandItem[] = [];
        oldItems.forEach(function(existingItem: CommandItem) {
            if (commandItem == existingItem) {
                return;
            }
            newItems.push(existingItem);
        })
        this.items = newItems;
        this.calcTotalPrice();
    }
    getCommandItem(item: Item) {
        var foundCommandItem = null;
        this.items.forEach(function(commandItem: CommandItem) {
            if (commandItem.item.equals(item)) {
                foundCommandItem = commandItem;
                return;
            }
        });
        return foundCommandItem;
    }
    getItems() {
        return this.items;
    }
    setReduction(item: Item, reduction: number) {
        var commandItem:CommandItem = this.getCommandItem(item);
        if (commandItem == null) {
            return;
        }
        commandItem.reduction = reduction;
        this.calcItemPrice(commandItem);
        this.calcTotalPrice();
    }
    calcTotalPrice() {
        this.totalPrice = 0;
        var thisService = this;
        this.items.forEach(function(item: CommandItem) {
            var price = item.price;
            thisService.totalPrice += price;
        });
        if (this.globalReduction != null) {
            var reduction = this.globalReduction * 0.01  * this.totalPrice;
            this.totalPrice -= reduction;
        }
        this.totalPrice = Number((this.totalPrice).toFixed(2));
    }
    calcItemPrice(commandItem: CommandItem) {
        var item = commandItem.item;
        if (item == null) {
            return;
        }
        var itemPrice = item.currentPrice;
        var amount = commandItem.amount;
        var totalPrice = amount * itemPrice ;

        var reduction = commandItem.reduction;
        if (reduction != null) {
            var reductionAmount = reduction * 0.01 * totalPrice;
            totalPrice -= reductionAmount;
        }
        commandItem.price = totalPrice;
    }
}

export class CommandService {
    activeCommands: Command[];
    lastCommandId: number;

    constructor() {
        this.activeCommands = [];
        this.lastCommandId = 0;
    }

    newCommand(): Command {
        var command = new Command();
        this.lastCommandId++;
        command.id = this.lastCommandId;
        this.activeCommands.push(command);
        return command;
    }

    nextActive(command: Command): Command {
        var activeIndex = null;
        for (var index = 0; index < this.activeCommands.length; index++) {
            var curCommand = this.activeCommands[index];
            if (curCommand == command) {
                activeIndex = index;
            }
        }
        activeIndex++;
        if (activeIndex >= this.activeCommands.length) {
            activeIndex = 0;
        }
        return this.activeCommands[activeIndex];
    }
    removeActiveCommand(command: Command) {
        var newCommands = [];
        this.activeCommands.forEach(function(activeCommand: Command) {
            if (command == activeCommand) {
                return;
            }
            newCommands.push(activeCommand);
        })
        this.activeCommands = newCommands;
    }

    saveCommand(command: Command) {
        this.removeActiveCommand(command);
    }
}