/**
 * Created by cghislai on 06/08/15.
 */
import {Inject, forwardRef} from 'angular2/angular2';

import {Item, ItemRef, ItemFactory} from 'client/domain/item';
import {Sale, SaleRef, SaleSearch, SaleFactory} from 'client/domain/sale';
import {ItemSale, ItemSaleRef, ItemSaleSearch, ItemSaleFactory} from 'client/domain/itemSale';

import {SaleClient} from 'client/sale';
import {ItemSaleClient} from 'client/itemSale';
import {ItemClient} from 'client/item';

import {ASale, ASaleItem} from 'client/utils/aSale';
import {LocaleTexts} from 'client/utils/lang';
import {SearchResult} from 'client/utils/search';
import {Pagination} from 'client/utils/pagination';
import {NumberUtils} from 'client/utils/number';
import {ComptoirRequest, ComptoirResponse} from 'client/utils/request';

import {AuthService} from 'services/auth';

export class SaleService {

    client:SaleClient;
    itemSaleClient:ItemSaleClient;
    itemClient:ItemClient;
    authService:AuthService;

    activeSale:Sale;

    constructor(@Inject authService:AuthService) {
        this.authService = authService;
        this.client = new SaleClient();
        this.itemClient = new ItemClient();
        this.itemSaleClient = new ItemSaleClient();
    }


    createSale(sale:Sale):Promise<SaleRef> {
        var authToken = this.authService.authToken;
        sale.companyRef = this.authService.loggedEmployee.companyRef;
        return this.client.createSale(sale, authToken);
    }

    updateSale(sale:Sale):Promise<SaleRef> {
        var authToken = this.authService.authToken;
        return this.client.updateSale(sale, authToken);
    }


    saveSale(sale:Sale):Promise<SaleRef> {
        var savePromise:Promise<SaleRef>;
        if (sale.id == undefined) {
            savePromise = this.createSale(sale);
        } else {
            savePromise = this.updateSale(sale);
        }
        return savePromise.then((saleRef)=> {
            sale.id = saleRef.id;
            return saleRef;
        });
    }


    getSale(id:number):Promise<Sale> {
        var authToken = this.authService.authToken;
        return this.client.getSale(id, authToken);
    }

    searchSales(saleSearch:SaleSearch, pagination:Pagination):Promise<SearchResult<Sale>> {
        var authToken = this.authService.authToken;
        saleSearch.companyRef = this.authService.loggedEmployee.companyRef;
        return this.client.searchSales(saleSearch, pagination, authToken);
    }

    removeSale(id:number):Promise<boolean> {
        var authToken = this.authService.authToken;
        return this.client.deleteSale(id, authToken)
            .then(()=> {
                return true;
            });
    }

    // ASale methods

    public createASale():ASale {
        var aSale = new ASale();
        aSale.items = [];
        aSale.itemsMap = {};
        aSale.saleId = null;
        aSale.sale = null;
        aSale.discountRate = 0;
        aSale.vatExclusive = 0;
        aSale.vatAmount = 0;
        aSale.dirty = false;
        this.calcASale(aSale);
        return aSale;
    }

    public fetchASaleAsync(aSale:ASale):Promise<ASale> {
        aSale.dirty = true;
        this.calcASale(aSale);
        return this.fetchASaleSaleAsync(aSale)
            .then(()=> {
                aSale.dirty = false;
                this.calcASale(aSale);
                return this.searchASaleItemsAsync(aSale);
            }).then(()=> {
                this.calcASale(aSale);
                for (var item of aSale.items) {
                    item.dirty = true;
                }
                return this.updateASaleItemsAsync(aSale);
            }).then(()=> {
                for (var item of aSale.items) {
                    item.dirty = false;
                }
                return aSale;
            });
    }


    public openASaleAsync(aSale:ASale):Promise<ASale> {
        if (aSale.sale != null) {
            throw 'sale already open';
        }
        aSale.dirty = true;

        return this.createASaleSaleAsync(aSale)
            .then(()=> {
                aSale.dirty = false;
                this.calcASale(aSale);
                return aSale;
            });
    }

    public closeASaleAsync(aSale:ASale):Promise<ASale> {
        if (aSale.sale == null) {
            throw 'sale not opened';
        }
        if (aSale.sale.closed) {
            throw 'sale already closed';
        }
        aSale.dirty = true;
        return this.closeASaleAsyncPrivate(aSale)
            .then(()=> {
                aSale.dirty = false;
                this.calcASale(aSale);
                return aSale;
            });
    }

    public removeASaleAsync(aSale:ASale):Promise<any> {
        if (aSale.sale == null) {
            return Promise.resolve();
        }
        var saleId = aSale.saleId;
        return this.removeSale(saleId);
    }

    public addItemToASaleAsync(aSale:ASale, item:Item):Promise<ASale> {
        if (aSale.sale == null) {
            throw 'sale not opened';
        }
        if (aSale.sale.closed) {
            throw 'sale closed';
        }
        var itemId = item.id;
        var aSaleItem = aSale.itemsMap[itemId];
        if (aSaleItem != null) {
            aSaleItem.quantity = aSaleItem.quantity + 1;
            aSaleItem.dirty = true;
            aSale.dirty = true;
            this.calcASale(aSale);
            return this.updateASaleItemAsync(aSaleItem)
                .then(()=> {
                    aSaleItem.dirty = false;
                    this.calcASale(aSale);
                    return this.fetchASaleSaleAsync(aSale);
                }).then(()=> {
                    aSale.dirty = false;
                    this.calcASale(aSale);
                    return aSale;
                });
        }
        // Create a new one
        aSaleItem = new ASaleItem();
        aSaleItem.aSale = aSale;
        aSaleItem.discountPercentage = 0;
        aSaleItem.discountRate = 0;
        aSaleItem.item = item;
        aSaleItem.itemId = item.id;
        aSaleItem.quantity = 1;
        aSaleItem.vatExclusive = item.vatExclusive;
        aSaleItem.vatRate = item.vatRate;
        aSaleItem.total = item.vatExclusive;

        aSale.items.push(aSaleItem);
        aSale.itemsMap[itemId] = aSaleItem;
        aSaleItem.dirty = true;
        aSale.dirty = true;

        this.calcASale(aSale);
        return this.createASaleItemAsync(aSaleItem)
            .then(()=> {
                aSaleItem.dirty = false;
                this.calcASale(aSale);
                return this.fetchASaleSaleAsync(aSale);
            }).then(()=> {
                aSale.dirty = false;
                this.calcASale(aSale);
                return aSale;
            });
    }

    public removeASaleItemAsync(aSaleItem:ASaleItem):Promise<ASale> {
        var aSale = aSaleItem.aSale;

        this.removeASaleItemFromASaleItems(aSaleItem);
        aSale.dirty = true;
        aSaleItem.dirty = true;
        return this.removeASaleItemAsyncPrivate(aSaleItem)
            .then(()=> {
                var taskList = [];
                taskList.push(this.fetchASaleAsync(aSale)
                    .then(()=> {
                        aSale.dirty = false;
                    }));
                taskList.push(this.searchASaleItemsAsync(aSale));
                return Promise.all(taskList)
                    .then(()=> {
                        return aSale;
                    });
            }).then(()=> {
                aSale.dirty = false;
                this.calcASale(aSale);
                return aSale;
            });
    }

    public setASaleDiscountPercentage(aSale:ASale, percentage:number):Promise<ASale> {
        var percentageInt = NumberUtils.toInt(percentage);
        if (isNaN(percentageInt)) {
            aSale.discountPercentage = null;
            aSale.discountRate = null;
        } else {
            var ratio = NumberUtils.toFixedDecimals(percentage / 100, 2);
            aSale.discountPercentage = percentageInt;
            aSale.discountRate = ratio;
        }
        aSale.dirty = true;

        this.updateASaleSaleAsync(aSale)
            .then(()=> {
                aSale.dirty = false;
                this.calcASale(aSale);
            });
        this.calcASale(aSale);
        return Promise.resolve(aSale);
    }

    public setASaleItemDiscountPercentageAsync(aSaleItem:ASaleItem, percentage:number):Promise<ASale> {
        var percentageInt = NumberUtils.toInt(percentage);
        var ratio = NumberUtils.toFixedDecimals(percentage / 100, 2);
        var aSale = aSaleItem.aSale;
        aSaleItem.discountPercentage = percentageInt;
        aSaleItem.discountRate = ratio;
        aSaleItem.dirty = true;
        aSale.dirty = true;

        this.calcASale(aSale);
        return this.updateASaleItemAsync(aSaleItem)
            .then(()=> {
                aSaleItem.dirty = false;
                this.calcASale(aSale);
                return this.fetchASaleSaleAsync(aSale);
            }).then(()=> {
                aSale.dirty = false;
                this.calcASale(aSale);
                return aSale;
            });
    }

    public setASaleItemQuantityAsync(aSaleItem:ASaleItem, quantity:number):Promise<ASale> {
        var quantityInt = NumberUtils.toInt(quantity);
        var aSale = aSaleItem.aSale;
        aSaleItem.quantity = quantityInt;
        aSaleItem.dirty = true;
        aSale.dirty = true;

        this.calcASale(aSale);
        return this.updateASaleItemAsync(aSaleItem)
            .then(()=> {
                aSaleItem.dirty = false;
                this.calcASale(aSale);
                return this.fetchASaleSaleAsync(aSale);
            }).then(()=> {
                aSale.dirty = false;
                this.calcASale(aSale);
                return aSale;
            });
    }

    public setASaleItemVatExclusiveAsync(aSaleItem:ASaleItem, vatExclusive:number):Promise<ASale> {
        var vatExclusiveFloat = NumberUtils.toFixedDecimals(vatExclusive, 2);
        var aSale = aSaleItem.aSale;
        aSaleItem.vatExclusive = vatExclusiveFloat;
        aSaleItem.dirty = true;
        aSale.dirty = true;

        this.calcASale(aSale);
        return this.updateASaleItemAsync(aSaleItem)
            .then(()=> {
                aSaleItem.dirty = false;
                this.calcASale(aSale);
                return this.fetchASaleSaleAsync(aSale);
            }).then(()=> {
                aSale.dirty = false;
                this.calcASale(aSale);
                return aSale;
            });
    }

    public setASaleItemCommentAsync(aSaleItem:ASaleItem, comment:LocaleTexts):Promise<ASale> {
        var aSale = aSaleItem.aSale;
        aSaleItem.comment = comment;
        aSaleItem.dirty = true;

        return this.updateASaleItemAsync(aSaleItem)
            .then(()=> {
                aSaleItem.dirty = false;
                return aSale;
            });
    }


    //
    // Private ones below run asynchronously (will resolve the returned promise later)
    //

    private createASaleSaleAsync(aSale:ASale):Promise<ASale> {
        if (aSale.saleRequest != null) {
            throw 'sale request already in progress - aborting creation';
        }
        var authToken = this.authService.authToken;
        var sale = new Sale();
        sale.companyRef = this.authService.loggedEmployee.companyRef;
        aSale.saleRequest = this.client.getCreateSaleRequest(sale, authToken);
        return aSale.saleRequest.run()
            .then((response:ComptoirResponse)=> {
                var saleRef:SaleRef = JSON.parse(response.text);
                aSale.saleId = saleRef.id;
                aSale.saleRequest = null;
                return this.fetchASaleSaleAsync(aSale);
            });
    }

    private fetchASaleSaleAsync(aSale:ASale):Promise<ASale> {
        if (aSale.saleRequest != null) {
            aSale.saleRequest.discardRequest();
        }
        var authToken = this.authService.authToken;
        var saleId = aSale.saleId;
        aSale.saleRequest = this.client.getGetSaleRequest(saleId, authToken);
        return aSale.saleRequest.run()
            .then((response:ComptoirResponse)=> {
                var sale:Sale = JSON.parse(response.text, SaleFactory.fromJSONSaleReviver);
                this.setASaleSale(aSale, sale);
                aSale.saleRequest = null;
                return aSale;
            });
    }

    private updateASaleSaleAsync(aSale:ASale):Promise<ASale> {
        if (aSale.saleRequest != null) {
            aSale.saleRequest.discardRequest();
        }
        this.updateSaleFromASale(aSale);
        var authToken = this.authService.authToken;
        aSale.saleRequest = this.client.getUpdateSaleRequest(aSale.sale, authToken);
        return aSale.saleRequest.run()
            .then((response:ComptoirResponse)=> {
                var saleRef:SaleRef = JSON.parse(response.text);
                aSale.saleRequest = null;
                aSale.saleId = saleRef.id;
                return this.fetchASaleSaleAsync(aSale);
            });
    }

    private setASaleSale(aSale:ASale, sale:Sale) {
        aSale.sale = sale;
        var discountAmount = NumberUtils.toFixedDecimals(sale.discountAmount, 2);
        aSale.discountAmount = discountAmount;
        var discountRate = NumberUtils.toFixedDecimals(sale.discountRatio, 2);
        aSale.discountRate = discountRate;
        ;
        aSale.saleRequest = null;
        aSale.saleId = sale.id;
        var vatAmount = NumberUtils.toFixedDecimals(sale.vatAmount, 2);
        aSale.vatAmount = vatAmount;
        var vatExclusive = NumberUtils.toFixedDecimals(sale.vatExclusiveAmount, 2);
        aSale.vatExclusive = vatExclusive;
    }

    private updateSaleFromASale(aSale:ASale) {
        var sale = aSale.sale;

        var discountRate = NumberUtils.toFixedDecimals(aSale.discountRate, 2);
        sale.discountRatio = discountRate;
    }

    private searchASaleItemsAsync(aSale:ASale):Promise<ASale> {
        if (aSale.searchItemsRequest != null) {
            aSale.searchItemsRequest.discardRequest();
        }
        var authToken = this.authService.authToken;
        var itemSaleSearch = new ItemSaleSearch();
        itemSaleSearch.companyRef = this.authService.loggedEmployee.companyRef;
        itemSaleSearch.saleRef = new SaleRef(aSale.saleId);
        aSale.searchItemsRequest = this.itemSaleClient.getSearchItemSalesRequest(itemSaleSearch, null, authToken);
        return aSale.searchItemsRequest.run()
            .then((response:ComptoirResponse)=> {
                var items:ItemSale[] = JSON.parse(response.text, ItemSaleFactory.fromJSONItemSaleReviver);
                this.setASaleItems(aSale, items);
                aSale.searchItemsRequest = null;
                return aSale;
            });
    }

    private setASaleItems(aSale:ASale, items:ItemSale[]) {
        var currentItemsMap = aSale.itemsMap;
        var newItemsList:ASaleItem[] = [];
        var newItemsMap = {};

        for (var fetchedItem of items) {
            var itemId = fetchedItem.itemRef.id;
            var aSaleItem:ASaleItem = currentItemsMap[itemId];
            if (aSaleItem != null) {
                if (!this.isASaleItemUpToDate(aSaleItem, fetchedItem)) {
                    if (aSaleItem.itemSaleRequest != null) {
                        aSaleItem.itemSaleRequest.discardRequest();
                    }
                    aSaleItem == null;
                }
            }
            if (aSaleItem == null) {
                aSaleItem = new ASaleItem();
            }
            aSaleItem.aSale = aSale;
            this.setASaleItemItemSale(aSaleItem, fetchedItem);
            newItemsMap[itemId] = aSaleItem;
            newItemsList.push(aSaleItem);
        }
        aSale.items = newItemsList;
        aSale.itemsMap = newItemsMap;
    }

    private setASaleItemItemSale(aSaleItem:ASaleItem, itemSale:ItemSale) {
        aSaleItem.comment = itemSale.comment;
        var discountPercentage = NumberUtils.toFixedDecimals(itemSale.discountRatio * 100, 2);
        aSaleItem.discountPercentage = discountPercentage;
        var discountRatio = NumberUtils.toFixedDecimals(itemSale.discountRatio, 2);
        aSaleItem.discountRate = discountRatio;
        aSaleItem.itemId = itemSale.itemRef.id;
        aSaleItem.itemSale = itemSale;
        aSaleItem.itemSaleId = itemSale.id;
        var quantity = NumberUtils.toInt(itemSale.quantity);
        aSaleItem.quantity = quantity;
        var vatExclusive = NumberUtils.toFixedDecimals(itemSale.vatExclusive, 2);
        aSaleItem.vatExclusive = vatExclusive;
        var vatRate = NumberUtils.toFixedDecimals(itemSale.vatRate, 2);
        aSaleItem.vatRate = vatRate;
        var total = NumberUtils.toFixedDecimals(itemSale.total, 2);
        aSaleItem.total = total;
        if (aSaleItem.itemId != aSaleItem.itemId) {
            aSaleItem.item = null;
        }
    }


    private updateItemSaleFromASaleItem(aSaleItem:ASaleItem) {
        var itemSale = aSaleItem.itemSale;
        itemSale.comment = aSaleItem.comment;
        var discountRate = NumberUtils.toFixedDecimals(aSaleItem.discountRate, 2);
        itemSale.discountRatio = discountRate;
        var quantity = NumberUtils.toInt(aSaleItem.quantity);
        itemSale.quantity = quantity;
        var vatExclusive = NumberUtils.toFixedDecimals(aSaleItem.vatExclusive, 2);
        itemSale.vatExclusive = vatExclusive;
        var vatRate = NumberUtils.toFixedDecimals(aSaleItem.vatRate, 2);
        itemSale.vatRate = vatRate;
    }

    private isASaleItemUpToDate(aSaleitem:ASaleItem, itemSale:ItemSale):boolean {
        if (aSaleitem.itemRequest != null) {
            return false;
        }
        if (aSaleitem.itemSaleRequest != null) {
            return false;
        }
        if (aSaleitem.itemSale == itemSale) {
            return true;
        }
        var oldItem = aSaleitem.itemSale;
        if (oldItem.comment != itemSale.comment) {
            return false;
        }
        if (oldItem.dateTime != itemSale.dateTime) {
            return false;
        }
        if (oldItem.discountRatio != itemSale.discountRatio) {
            return false;
        }
        if (oldItem.id != itemSale.id) {
            return false;
        }
        if (oldItem.itemRef != itemSale.itemRef) {
            return false;
        }
        if (oldItem.quantity != itemSale.quantity) {
            return false;
        }
        if (oldItem.saleRef != itemSale.saleRef) {
            return false;
        }
        if (oldItem.vatExclusive != itemSale.vatExclusive) {
            return false;
        }
        if (oldItem.vatRate != itemSale.vatRate) {
            return false;
        }
        return true;
    }

    private updateASaleItemsAsync(aSale:ASale):Promise<ASale> {
        var taskList:Promise<any>[] = [];
        var items = aSale.items;
        for (var item of items) {
            if (item.itemSale == null) {
                taskList.push(this.fetchASaleItemAsync(item)
                    .then(()=> {
                        return this.fetchASaleItemItemAsync(item);
                    }));
            } else if (item.item == null) {
                taskList.push(this.fetchASaleItemItemAsync(item));
            }
        }
        return Promise.all(taskList)
            .then(()=> {
                return aSale;
            });
    }

    private fetchASaleItemAsync(aSaleItem:ASaleItem):Promise<ASaleItem> {
        if (aSaleItem.itemSaleRequest != null) {
            aSaleItem.itemSaleRequest.discardRequest();
        }
        var authToken = this.authService.authToken;
        aSaleItem.itemSaleRequest = this.itemSaleClient.getGetItemSaleRequest(aSaleItem.itemSaleId, authToken);
        return aSaleItem.itemSaleRequest.run()
            .then((response:ComptoirResponse)=> {
                var itemSale:ItemSale = JSON.parse(response.text, ItemSaleFactory.fromJSONItemSaleReviver);
                this.setASaleItemItemSale(aSaleItem, itemSale);
                aSaleItem.itemSaleRequest = null;
                return aSaleItem;
            });
    }

    private fetchASaleItemItemAsync(aSaleItem:ASaleItem):Promise<ASaleItem> {
        if (aSaleItem.itemRequest != null) {
            aSaleItem.itemRequest.discardRequest();
        }
        var item = aSaleItem.item;
        var itemSale = aSaleItem.itemSale;
        if (item != null && itemSale != null) {
            if (item.id = itemSale.itemRef.id) {
                // Items probably wont change during a sale
                return;
            }
        }
        var authToken = this.authService.authToken;
        var itemId = aSaleItem.itemId;
        aSaleItem.itemRequest = this.itemClient.getGetItemRequest(itemId, authToken);
        return aSaleItem.itemRequest.run()
            .then((response:ComptoirResponse)=> {
                var item:Item = JSON.parse(response.text, ItemFactory.fromJSONItemReviver);
                this.setASaleItemItem(aSaleItem, item);
                aSaleItem.itemRequest = null;
                return aSaleItem;
            });
    }

    private setASaleItemItem(aSaleItem:ASaleItem, item:Item) {
        aSaleItem.item = item;
        aSaleItem.vatExclusive = item.vatExclusive;
        aSaleItem.vatRate = item.vatRate;
    }

    private createASaleItemAsync(aSaleItem:ASaleItem):Promise<ASaleItem> {
        if (aSaleItem.itemSaleRequest != null) {
            throw 'item sale request in progress - aborting creation';
        }
        var aSale = aSaleItem.aSale;
        var saleId = aSale.saleId;
        var saleRef = new SaleRef(saleId);
        var itemId = aSaleItem.itemId;
        var itemRef = new ItemRef(itemId);

        var itemSale = new ItemSale();
        itemSale.itemRef = itemRef;
        itemSale.saleRef = saleRef;
        aSaleItem.itemSale = itemSale;
        this.updateItemSaleFromASaleItem(aSaleItem);

        var authToken = this.authService.authToken;

        aSaleItem.itemSaleRequest = this.itemSaleClient.getCreateItemSaleRequest(itemSale, authToken);
        return aSaleItem.itemSaleRequest.run()
            .then((response:ComptoirResponse)=> {
                var itemSaleRef:ItemSaleRef = JSON.parse(response.text);
                aSaleItem.itemSaleId = itemSaleRef.id;
                aSaleItem.itemSaleRequest = null;
                return this.fetchASaleItemAsync(aSaleItem);
            });
    }

    private updateASaleItemAsync(aSaleItem:ASaleItem):Promise<ASaleItem> {
        if (aSaleItem.itemSaleRequest != null) {
            aSaleItem.itemSaleRequest.discardRequest();
        }
        var itemSale = aSaleItem.itemSale;
        this.updateItemSaleFromASaleItem(aSaleItem);

        var authToken = this.authService.authToken;
        aSaleItem.itemSaleRequest = this.itemSaleClient.getUpdateItemSaleRequest(itemSale, authToken);
        return aSaleItem.itemSaleRequest.run()
            .then((response:ComptoirResponse)=> {
                var itemSaleRef:ItemSaleRef = JSON.parse(response.text);
                aSaleItem.itemSaleId = itemSaleRef.id;
                aSaleItem.itemSaleRequest = null;
                return this.fetchASaleItemAsync(aSaleItem);
            });
    }


    private removeASaleItemAsyncPrivate(aSaleItem:ASaleItem):Promise<ASale> {
        if (aSaleItem.itemSaleRequest != null) {
            aSaleItem.itemSaleRequest.discardRequest();
        }
        if (aSaleItem.itemRequest != null) {
            aSaleItem.itemRequest.discardRequest();
        }
        var aSale = aSaleItem.aSale;
        var itemSaleId = aSaleItem.itemSaleId;
        var authToken = this.authService.authToken;
        return this.itemSaleClient.removeItemSale(itemSaleId, authToken)
            .then(()=> {
                return aSale;
            });
    }

    private removeASaleItemFromASaleItems(aSaleItem:ASaleItem) {
        var aSale = aSaleItem.aSale;
        var itemId = aSaleItem.itemId;
        var items = aSale.items;
        var itemsMap = aSale.itemsMap;
        var newItems = [];

        delete itemsMap[itemId];
        for (var item of items) {
            if (item == aSaleItem) {
                continue;
            }
            newItems.push(item);
        }
        aSale.items = newItems;
    }

    private closeASaleAsyncPrivate(aSale:ASale):Promise<ASale> {
        if (aSale.saleRequest != null) {
            aSale.saleRequest.discardRequest();
        }
        if (aSale.searchItemsRequest != null) {
            aSale.searchItemsRequest.discardRequest();
        }
        var saleId = aSale.saleId;
        var authToken = this.authService.authToken;
        return this.client.closeSale(saleId, authToken)
            .then(()=> {
                return this.fetchASaleSaleAsync(aSale);
            });
    }

    private calcASale(aSale:ASale) {
        var sale = aSale.sale;
        var vatExlusive = 0;
        var vatAmount = 0;

        for (var aSaleItem of aSale.items) {
            var itemVatExclusive:number = null;
            var itemVatRate:number = null;
            var itemDiscountRatio:number = null;
            var itemTotal:number = null;

            var itemSale = aSaleItem.itemSale;
            if (!aSaleItem.dirty && itemSale != null) {
                itemVatExclusive = itemSale.vatExclusive;
                itemVatRate = itemSale.vatRate;
                itemDiscountRatio = itemSale.discountRatio;
                itemTotal = itemSale.total;

                aSaleItem.vatExclusive = itemVatExclusive;
                aSaleItem.vatRate = itemVatRate;
                aSaleItem.total = itemTotal;

                var itemVatAmount = itemVatRate * itemTotal;
                vatExlusive += itemTotal;
                vatAmount += itemVatAmount;
                continue;
            }

            var item = aSaleItem.item;
            if (item == null) {
                // Cant do anything
                continue;
            }
            itemVatExclusive = item.vatExclusive;
            itemDiscountRatio = aSaleItem.discountRate;
            itemVatRate = item.vatRate;
            itemTotal = itemVatExclusive * aSaleItem.quantity;
            if (itemDiscountRatio != null) {
                itemTotal *= (1 - itemDiscountRatio);
            }

            var itemVatAmount = itemVatRate * itemTotal;
            aSaleItem.vatExclusive = itemVatExclusive;
            aSaleItem.vatRate = itemVatRate;
            aSaleItem.total = itemTotal;

            vatExlusive += itemTotal;
            vatAmount += itemVatAmount;
        }

        if (!aSale.dirty && sale != null) {
            aSale.vatAmount = sale.vatAmount;
            aSale.vatExclusive = sale.vatExclusiveAmount;
            aSale.discountAmount = sale.discountAmount;
            aSale.total = aSale.vatExclusive + aSale.vatAmount;
            return;
        }

        var discountAmount = 0;
        if (aSale.discountRate != null) {
            discountAmount = aSale.discountRate * vatExlusive;
            var tvaDiscount = aSale.discountRate * vatAmount;
            vatExlusive -= discountAmount;
            vatAmount -= tvaDiscount;
        }

        aSale.discountAmount = discountAmount;
        aSale.vatAmount = vatAmount;
        aSale.vatExclusive = vatExlusive;
        aSale.total = aSale.vatExclusive + aSale.vatAmount;
    }

}