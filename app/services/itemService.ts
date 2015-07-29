/**
 * Created by cghislai on 29/07/15.
 */

export class Item {
    id: number;
    companyId: number;
    reference: string;
    model: string;
    name: string;
    description: string;
    currentPrice: number;

    constructor(params) {
        if (params != undefined) {
            this.id = params.id;
            this.companyId = params.companyId;
            this.reference = params.reference;
            this.model = params.model;
            this.name = params.name;
            this.description = params.description;
            this.currentPrice = params.currentPrice;
        }
    }
    equals(other: Item) {
        if (this.id == undefined || other.id == undefined) {
            return false;
        }
        return this.id == other.id;
    }
}

export class ItemService {
    items: Item[];

    searchItems() {
        this.items = [];
        this.fillDefaultItems();
    }
    addItem(item: Item) {
        this.items.push(item);
    }
    removeItem(item: Item) {
        var oldItems = this.items;
        this.items = [];
        for (var index = 0; index < oldItems.length; index++) {
            var oldItem = oldItems[index];
            if (oldItem.equals(item)) {
                continue;
            }
            this.items.push(oldItem);
        }
    }
    getItems() {
        return this.items;
    }
    getItem(id: number) {
        for (var index = 0; index < this.items.length; index++) {
            var item = this.items[index];
            if (item.id == id) {
                return item;
            }
        }
        return null;
    }
    findItems(filterValue: string) {
        var foundItems = [];
        this.items.forEach(function(item: Item) {
            if (item.reference.indexOf(filterValue)== 0) {
                foundItems.push(item);
                return;
            }
            if (item.name.indexOf(filterValue) >= 0) {
                foundItems.push(item);
                return;
            }
        })
        return foundItems;
    }
    fillDefaultItems() {
        var allItems = [
            {
                id: 0,
                companyId: 0,
                reference: "BO001",
                model: null,
                name: "Bonnet Minnie",
                description: "Un bonnet à l'effigie de Minnie, la copine de Mickey.",
                currentPrice: 5.9
            },
            {
                id: 1,
                companyId: 0,
                reference: "BO002",
                model: null,
                name: "Bonnet Mickey",
                description: "Un bonnet à l'effigie de Mickey Mouse. Pour garçons et filles",
                currentPrice: 5.9
            },
            {
                id: 2,
                companyId: 0,
                reference: "PU001",
                model: "8 ans vert",
                name: "Pull el laine Defrost",
                description: null,
                currentPrice: 21.5
            },
            {
                id: 3,
                companyId: 0,
                reference: "PU002",
                model: "8 ans rouge",
                name: "Pull en laine Defrost",
                description: null,
                currentPrice: 21.5
            },
            {
                id: 4,
                companyId: 0,
                reference: "PU003",
                model: "10-12 ans vert",
                name: "Pull en laine Defrost",
                description: null,
                currentPrice: 21.5
            },
            {
                id: 5,
                companyId: 0,
                reference: "PU004",
                model: "12-12 ans rouge",
                name: "Pull en laine Defrost",
                description: null,
                currentPrice: 21.5
            },
            {
                id: 6,
                companyId: 0,
                reference: "JDA001",
                model: "8 ans rouge",
                name: "T-shirt joli",
                description: "Un joli T-shirt rouge",
                currentPrice: 6
            },
            {
                id: 7,
                companyId: 0,
                reference: "JDA002",
                model: "10-12 ans rouge",
                name: "T-shirt joli",
                description: "Un joli T-shirt rouge",
                currentPrice: 6
            },
            {
                id: 8,
                companyId: 0,
                reference: "JDA003",
                model: "S rouge",
                name: "T-shirt joli",
                description: "Un joli T-shirt rouge",
                currentPrice: 6
            },
            {
                id: 9,
                companyId: 0,
                reference: "JDA004",
                model: "M rouge",
                name: "T-shirt joli",
                description: "Un joli T-shirt rouge",
                currentPrice: 6
            }
        ];
        this.items = new Array<Item>();
        var thisService = this;
        allItems.forEach(function(itemParams) {
            var item = new Item(itemParams);
            thisService.items.push(item);
        });
    }
}