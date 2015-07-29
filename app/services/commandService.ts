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
        this.amount =0;
        this.reduction = null;
        this.price = 0;
    }
}

export class CommandService {
    items: CommandItem[];
    totalPrice: number;

    constructor() {
        this.items = [];
        this.totalPrice = 0;
    }

    addItem(item: Item) {
        var id = item.id;
        var commandItem: CommandItem = null;
        if (this.items[id] != undefined) {
            commandItem = this.items[id];
        } else {
            commandItem = new CommandItem(item);
        }
        commandItem.amount++;
        this.calcItemPrice(commandItem);
        this.calcTotalPrice();
    }
    removeItem(item: Item) {
        var id = item.id;
        this.items[id] = undefined;
        this.calcTotalPrice();
    }
    setReduction(item: Item, reduction: number) {
        var id = item.id;
        if (this.items[id] == undefined) {
            return;
        }
        var commandItem = this.items[id];
        commandItem.reduction = reduction;
        this.calcItemPrice(commandItem);
        this.calcTotalPrice();
    }
    calcTotalPrice() {
        this.totalPrice = 0;
        this.items.forEach(function(item: CommandItem) {
            var price = item.price;
            this.totalPrice += price;
        });
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
            var reductionAmount = reduction * totalPrice;
            totalPrice -= reduction;
        }
        commandItem.price = totalPrice;
    }
}