/**
 * Created by cghislai on 29/07/15.
 */

import {Injectable} from 'angular2/angular2';
import {LocalizedString} from 'services/applicationService';

export class Item {
    id:number;
    companyId:number;
    reference:string;
    model:LocalizedString;
    name:LocalizedString;
    description:LocalizedString;
    currentPrice:number;

    constructor() {
        this.model = new LocalizedString(null, null);
        this.name= new LocalizedString(null, null);
        this.description= new LocalizedString(null, null);
    }
    fromParams(params):Item {
        if (params != undefined) {
            var language = params.language;
            if (params.id != null) {
                this.id = params.id;
            }
            if (params.companyId != null) {
                this.companyId = params.companyId;
            }
            if (params.reference != null) {
                this.reference = params.reference;
            }
            this.model = new LocalizedString(language, params.model);
            this.name = new LocalizedString(language, params.name);
            this.description = new LocalizedString(language, params.description);
            if (params.currentPrice != null) {
                if (typeof (params.currentPrice) == "string") {
                    params.currentPrice = parseFloat(params.currentPrice);
                }
                this.currentPrice = params.currentPrice;
            }
        }

        return this;
    }

    equals(other:Item) {
        if (this.id == undefined || other.id == undefined) {
            if (this.reference == undefined || other.reference == undefined) {
                return false;
            }
            return this.reference == other.reference;
        }
        return this.id == other.id;
    }
}

export class ItemSearch {
    multiSearch:string;
}

export class ItemService {
    items:Item[];
    bootstrapped: boolean = false;

    constructor(){
    }
    searchItems() {
        this.fillDefaultItems();
    }

    saveItem(item:Item) {
    if (this.conatains(item )) {
        return;
    }
        this.items.push(item);
    }

    removeItem(item:Item) {
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

    getItem(id:number) {
        for (var index = 0; index < this.items.length; index++) {
            var item = this.items[index];
            if (item.id == id) {
                return item;
            }
        }
        return null;
    }
    conatains(item: Item ) {
        var contains = false;
        this.items.forEach(function(existingItem:Item) {
            if (item == existingItem) {
                contains = true;
                return ;
            }
        })
        return contains;
    }
    findItems(itemSearch:ItemSearch) {
        var foundItems = [];
        var multiStringValue = itemSearch.multiSearch;
        this.items.forEach(function (item:Item) {
            if (item.reference.indexOf(multiStringValue) == 0) {
                foundItems.push(item);
                return;
            }
            if (item.name.text.indexOf(multiStringValue) >= 0) {
                foundItems.push(item);
                return;
            }
        })
        return foundItems;
    }

    fillDefaultItems() {
        if (this.bootstrapped) {
            return;
        }
        this.bootstrapped = true
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
                name: "Pull en laine Defrost",
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
        allItems.forEach(function (itemParams) {
            var item = new Item().fromParams(itemParams);
            thisService.items.push(item);
        });
    }
}