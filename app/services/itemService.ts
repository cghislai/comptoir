/**
 * Created by cghislai on 29/07/15.
 */

import {Inject, forwardRef} from 'angular2/angular2';
import {Picture, PictureService} from 'services/pictureService';
import {Pagination, Locale} from 'services/utils'
import {LocaleText} from 'client/domain/lang';

export class Price {
    static DEFAULT_VAT_RATE:number = 0.21;
    id:number = null;
    startDateTime:Date = null;
    endDateTime:Date = null;
    vatExclusive:number = null;
    vatRate:number = null;

    constructor() {
        this.vatRate = Price.DEFAULT_VAT_RATE;
    }
}

export class Item {
    id:number = null;
    companyId:number = null;
    reference:string = null;
    model:string = null;
    name:LocaleText = null;
    description:LocaleText = null;
    currentPrice:Price = null;
    pictureId:number = null;
    picture:Picture = null;

    constructor() {
        this.name = new LocaleText();
        this.description = new LocaleText();
        this.currentPrice = new Price();
        this.picture = new Picture();
    }

    getTotalPrice():number {
        var vatExclusive = this.currentPrice.vatExclusive;
        var vatRate = this.currentPrice.vatRate;
        if (vatRate == null) {
            vatRate = Price.DEFAULT_VAT_RATE;
        }
        var total = vatExclusive * (1 + vatRate);
        return total;
    }

    static fromParams(params):Item {
        var item = new Item();
        if (params != undefined) {
            var language:Locale = params.language;
            if (language == null) {
                language = Locale.DEFAULT_LOCALE;
            }
            if (params.id != null) {
                item.id = params.id;
            }
            if (params.companyId != null) {
                item.companyId = params.companyId;
            }
            if (params.reference != null) {
                item.reference = params.reference;
            }
            if (params.pictureId != null) {
                item.pictureId = params.pictureId;
            }
            if (params.model != null) {
                item.model = params.model;
            }
            item.name = new LocaleText();
            item.name.localeTextMap[language.isoCode] = params.name;
            item.description = new LocaleText();
            item.description.localeTextMap[language.isoCode] = params.description;
            if (params.currentPrice != null) {
                if (typeof (params.currentPrice) == "string") {
                    params.currentPrice = parseFloat(params.currentPrice);
                }
                item.currentPrice = new Price();
                item.currentPrice.vatExclusive = params.currentPrice;
            }
        }
        return item;
    }

    static fromJson(jsonObject):Item {
        var item = new Item();
        return item;
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
    pagination:Pagination = null;
    companyId:number = null;
    multiSearch:string = null;
    nameContains:string = null;
    descriptionContains:string = null;
    reference:string = null;
    referenceContains:string = null;
    model:string = null;
}

export class ItemService {
    private allItems:Item[];

    pictureService:PictureService;

    constructor(@Inject pictureService:PictureService) {
        this.pictureService = pictureService;
        this.fillDefaultItems();
        this.findItemPictures(this.allItems);
    }

    public getItem(id: number):Promise<Item> {
        var allItems = this.allItems;
        return new Promise((resolve, reject) => {
            var foundItem = null;
            allItems.forEach(function(item: Item) {
                if (foundItem == null && item.id == id) {
                    foundItem = item;
                    return;
                }
            })
            resolve(foundItem);
        });
    }

    public countItems(itemSearch:ItemSearch):Promise<number> {
        // TODO
        return new Promise((resolve, reject) => {
            var count = this.allItems.length;
            resolve(count);
        });
    }

    public findItems(itemSearch:ItemSearch):Promise<Item[]> {
        // TODO
        var allItems = this.allItems;
        return new Promise((resolve, reject) => {
            var items = allItems;
            if (itemSearch == null) {
                resolve(items);
            }
            var multiStringValue = itemSearch.multiSearch;
            if (multiStringValue != null && multiStringValue.length > 0) {
                var foundItems = [];
                this.allItems.forEach(function (item:Item) {
                    if (item.reference.indexOf(multiStringValue) == 0) {
                        foundItems.push(item);
                        return;
                    }
                    var localeName = item.name;
                    for (var lang in localeName) {
                        var name:string = localeName[lang];
                        if (name.indexOf(multiStringValue) >= 0) {
                            foundItems.push(item);
                            return;
                        }
                    }
                })
                items = foundItems;
            }
            var pagination = itemSearch.pagination;
            if (pagination != null) {
                var first = pagination.firstIndex;
                var size = pagination.pageSize;
                size = Math.min(size, items.length);
                var pageItems = [];
                for (var pageIndex = 0; pageIndex < size; pageIndex++) {
                    var item = items[first + pageIndex];
                    pageItems.push(item);
                }
                items = pageItems;
            }
            resolve(items);
        });
    }

    public saveItem(item:Item):Promise<Item> {
        // TODO
        var id = this.allItems.length;
        item.id = id;
        var thisService = this;
        return new Promise((resolve, reject) => {
            if (thisService.contains(item)) {
                return;
            }
            thisService.allItems.push(item);
            resolve(item);
        });

    }

    public removeItem(item:Item):Promise<boolean> {
        // TODO
        var thisService = this;
        return new Promise((resolve, reject) => {
            var oldItems = thisService.allItems;
            thisService.allItems = [];
            for (var index = 0; index < oldItems.length; index++) {
                var oldItem = oldItems[index];
                if (oldItem.equals(item)) {
                    continue;
                }
                thisService.allItems.push(oldItem);
            }
            resolve(true);
        });

    }

    public findItemPicture(item:Item):Promise<Picture> {
        var thisService = this;
        return new Promise((resolve, reject) => {
            if (item.pictureId == null) {
                return;
            }
            var picture = thisService.pictureService.getPicture(item.pictureId);
            resolve(picture);
        });
    }

    public findItemPictures(items:Item[]):Promise<any> {
        var thisService = this;
        var promises = [];
        items.forEach(function (item:Item) {
            var promise = thisService.findItemPicture(item);
            promise.then(function (picture:Picture) {
                item.picture = picture;
            });
            promises.push(promise);
        })
        return Promise.all(promises);
    }


    private contains(item:Item) {
        // TODO REMOVE
        var contains = false;
        this.allItems.forEach(function (existingItem:Item) {
            if (item == existingItem) {
                contains = true;
                return;
            }
        })
        return contains;
    }

    private fillDefaultItems() {
        // TODO REMOVE
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
            var item = Item.fromParams(itemParams);
            thisService.allItems.push(item);
        });
    }
}