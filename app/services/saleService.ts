/**
 * Created by cghislai on 28/07/15.
 */
import {Item} from 'client/domain/item' ;
import {Pagination} from 'client/utils/pagination';
import {SearchResult} from 'client/utils/searchResult';

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

export class CommandSearch {
    pagination: Pagination;
    active: boolean;
}

export class Command {
    items: CommandItem[];
    globalReduction: number;
    vatExclusiveAmount: number;
    vatAmount: number;
    reductionAmount: number;
    totalPrice: number;
    id: number;
    companyId: number;
    dateTime: Date;
    active: boolean;
    paid: boolean;

    constructor() {
        this.items = [];
        this.globalReduction = null;
        this.vatExclusiveAmount = 0;
    }
    reset() {
        this.items = [];
        this.vatExclusiveAmount = 0;
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
            if (commandItem.item == item) {
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
            if (commandItem.item == item) {
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
        this.vatExclusiveAmount = 0;
        this.vatAmount = 0;
        var thisService = this;
        this.items.forEach(function(item: CommandItem) {
            var price = item.price;
            thisService.vatExclusiveAmount += price;

            var vat = item.item.vatRate * price;
            thisService.vatAmount += vat;
        });
        if (this.globalReduction != null) {
            this.reductionAmount = this.globalReduction * 0.01  * this.vatExclusiveAmount;
            this.vatExclusiveAmount -= this.reductionAmount;
            var vatReduction = this.vatAmount * this.globalReduction * 0.01;
            this.vatAmount -= vatReduction;
        } else {
            this.reductionAmount = 0;
        }
        this.vatExclusiveAmount = Number((this.vatExclusiveAmount).toFixed(2));
        this.vatAmount = Number(( this.vatAmount).toFixed(2));
        this.totalPrice =  Number((this.vatExclusiveAmount + this.vatAmount).toFixed(2));
    }

    calcItemPrice(commandItem: CommandItem) {
        var item = commandItem.item;
        if (item == null) {
            return;
        }
        var itemPrice = item.vatExclusive;
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

export class SaleService {
    fakeData: Command[];
    fakeIdCounter: number = 0;
    activeCommand: Command;

    constructor() {
        this.initFakeData();
    }

    searchCommands(commandSearch: CommandSearch): Promise<SearchResult<Command>> {
        // TODO
        var thisService = this;
        return new Promise((resolve, reject)=> {
            var foundData:Command[] = [];
            var commandSize = thisService.fakeData.length;
            var index = 0;
            while (index < commandSize) {
                var command = thisService.fakeData[index];
                index++;
                var active = commandSearch.active;
                if (active != undefined) {
                    if (command.active != active) {
                        continue;
                    }
                }
                foundData.push(command);
            }
            var paginatedData:Command[] = [];
            var lastIndex = commandSearch.pagination.firstIndex + commandSearch.pagination.pageSize;
            lastIndex = Math.min(lastIndex, foundData.length);
            for (index = commandSearch.pagination.firstIndex; index < lastIndex; index++) {
                var command = foundData[index];
                paginatedData.push(command);
            }
            var result = new SearchResult<Command>();
            result.count = foundData.length;
            result.list = paginatedData;
            resolve(result);
        });
    }

    removeCommand(command: Command): Promise<boolean>{
        var thisService = this;
        var data = this.fakeData;
        return new Promise((resolve, reject)=>{
            var newData = [];
            for (var exitingCommand of data) {
                if (exitingCommand != command) {
                    newData.push(exitingCommand);
                }
            }
            if (thisService.activeCommand == command) {
                thisService.activeCommand = null;
            }
            thisService.fakeData = newData;
            resolve(true);
        });
    }

    newCommand(): Command {
        var command = null;
        command = new Command();
        command.active = true;
        return command;
    }

    saveCommand(command: Command) {
        if (command.id == undefined) {
            this.fakeIdCounter++;
            command.id = this.fakeIdCounter;
            this.fakeData.push(command);
        }
    }

    getCommand(id: number) {
        for (var command of this.fakeData) {
            if (command.id == id) {
                return command;
            }
        }
    }

    initFakeData() {
        this.fakeData = [];
    }
}