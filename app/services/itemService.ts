/**
 * Created by cghislai on 29/07/15.
 */

import {Inject, forwardRef} from 'angular2/angular2';
import {LocalizedString} from 'services/applicationService';
import {Picture, PictureService} from 'services/pictureService';
import {Pagination} from 'services/utils'

export class Item {
    id:number = null;
    companyId:number = null;
    reference:string = null;
    model:LocalizedString = null;
    name:LocalizedString = null;
    description:LocalizedString = null;
    currentPrice:number = null;
    pictureId: number = null;
    picture: Picture = null;

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
            if (params.pictureId != null) {
                this.pictureId = params.pictureId;
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
    pagination: Pagination;
}

export class ItemService {
    private allItems: Item[];

    items:Item[];
    itemsCount: number;
    pictureService: PictureService;

    constructor(@Inject pictureService: PictureService){
        this.pictureService = pictureService;
        this.fillDefaultItems();
        this.findItemPictures(this.allItems);
    }

    public findItems(itemSearch:ItemSearch): Item[] {
        this.items = this.allItems;
        this.itemsCount = this.items.length;
        if (itemSearch == null) {
            return this.items;
        }
        var multiStringValue = itemSearch.multiSearch;
        if (multiStringValue != null) {
            this.items = [];
            this.allItems.forEach(function (item:Item) {
                if (item.reference.indexOf(multiStringValue) == 0) {
                    this.items.push(item);
                    return;
                }
                if (item.name.text.indexOf(multiStringValue) >= 0) {
                    this.items.push(item);
                    return;
                }
            })
        }
        var pagination = itemSearch.pagination;
        if (pagination != null) {
            var first = pagination.firstIndex;
            var size = pagination.pageSize;
            var pageItems = [];
            for (var pageIndex = 0; pageIndex < size; pageIndex++) {
                var item = this.items[first + pageIndex];
                pageItems.push(item);
            }
            this.items = pageItems;
        }
        return this.items;
    }

    public saveItem(item:Item) {
    if (this.contains(item )) {
        return;
    }
        this.allItems.push(item);
    }

    public removeItem(item:Item) {
        var oldItems = this.allItems;
        this.allItems = [];
        for (var index = 0; index < oldItems.length; index++) {
            var oldItem = oldItems[index];
            if (oldItem.equals(item)) {
                continue;
            }
            this.allItems.push(oldItem);
        }
    }

    public getItem(id:number) {
        for (var index = 0; index < this.allItems.length; index++) {
            var item = this.allItems[index];
            if (item.id == id) {
                return item;
            }
        }
        return null;
    }
    private contains(item: Item ) {
        var contains = false;
        this.allItems.forEach(function(existingItem:Item) {
            if (item == existingItem) {
                contains = true;
                return ;
            }
        })
        return contains;
    }

    private findItemPictures(items: Item[]) {
        var thisService = this;
        items.forEach(function(item: Item) {
            if (item.pictureId == null) {
                return;
            }
            var picture = thisService.pictureService.getPicture(item.pictureId);
            item.picture = picture;
        })
    }

    private fillDefaultItems() {
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
        this.allItems = new Array<Item>();
        var thisService = this;
        allItems.forEach(function (itemParams) {
            var item = new Item().fromParams(itemParams);
            thisService.allItems.push(item);
        });
    }
}