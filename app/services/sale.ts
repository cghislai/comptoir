/**
 * Created by cghislai on 06/08/15.
 */
import {Inject, forwardRef} from 'angular2/angular2';

import {Item, ItemRef} from 'client/domain/item';
import {Sale, SaleRef, SaleSearch} from 'client/domain/sale';
import {ItemSale, ItemSaleRef, ItemSaleSearch} from 'client/domain/itemSale';

import {SaleClient} from 'client/sale';
import{ItemSaleClient} from 'client/itemSale';
import {ItemClient} from 'client/item';

import {ASale, ASaleItem} from 'client/utils/aSale';
import {LocaleTexts} from 'client/utils/lang';
import {SearchResult} from 'client/utils/search';
import {Pagination} from 'client/utils/pagination';

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

    createASale():Promise<ASale> {
        var aSale = new ASale();
        aSale.items = [];
        aSale.itemsMap = {};
        aSale.saleId = null;
        aSale.sale = null;
        aSale.discountRate = null;
        aSale.vatExclusive = null;
        aSale.vatAmount = null;
        aSale.dirty = false;
        return new Promise<ASale>((resolve, reject)=> {
            resolve(aSale);
        });
    }

    getASale(saleId:number):Promise<ASale> {
        var aSale = new ASale();
        aSale.items = [];
        aSale.itemsMap = {};
        aSale.saleId = saleId;
        aSale.sale = null;
        aSale.discountRate = null;
        aSale.vatExclusive = null;
        aSale.vatAmount = null;
        aSale.dirty = true;

        // Fetch in background
        this.reFetchOnASaleChanged(aSale)
            .then(()=> {
            });

        // Return directly
        return new Promise<ASale>((resolve, reject)=> {
            resolve(aSale);
        });
    }

    reFetchOnASaleChanged(aSale:ASale):Promise<ASale> {
        var saleId = aSale.saleId;
        var taskList:Promise<any>[] = [
            this.getSale(saleId)
                .then((sale)=> {
                    aSale.sale = sale;
                    aSale.discountAmount = sale.discountAmount;
                    aSale.discountRate = sale.discountRatio;
                    aSale.vatAmount = sale.vatAmount;
                    aSale.vatExclusive = sale.vatExclusiveAmount;
                    aSale.dirty = false;
                })
            ,
            this.getASaleItems(aSale, saleId)
        ];

        // Fetch in background
        return Promise.all(taskList)
            .then(()=> {
                this.calcASale(aSale);
                return aSale;
            });
    }

    calcASale(aSale:ASale) {
        var sale = aSale.sale;

        var vatExlusive = 0;
        var vatAmount = 0;


        for (var aSaleItem of aSale.items) {
            var itemVatExclusive:number = null;
            var itemVatRate:number = null;
            var itemDiscountRatio:number = null;

            var itemSale = aSaleItem.itemSale;
            if (!aSaleItem.dirty && itemSale != null) {
                itemVatExclusive = itemSale.vatExclusive;
                itemVatRate = itemSale.vatRate;
                itemDiscountRatio = itemSale.discountRatio;

                aSaleItem.vatExclusive = itemVatExclusive;
                aSaleItem.vatRate = itemVatRate;
                vatExlusive += itemVatExclusive;
                vatAmount += itemVatAmount;
                continue;
            }

            var item = aSaleItem.item;
            if (item == null) {
                // Cant do anything
                continue;
            }
            itemVatExclusive = item.vatExclusive * aSaleItem.quantity;
            itemDiscountRatio = aSaleItem.discountRate;
            itemVatRate = item.vatRate;

            if (itemDiscountRatio != null) {
                var itemDiscountAmount = itemDiscountRatio * itemVatExclusive;
                itemVatExclusive -= itemDiscountAmount;
            }


            var itemVatAmount = itemVatRate * itemVatExclusive;
            aSaleItem.vatExclusive = itemVatExclusive;
            aSaleItem.vatRate = itemVatRate;

            vatExlusive += itemVatExclusive;
            vatAmount += itemVatAmount;
        }

        if (!aSale.dirty && sale != null) {
            aSale.vatAmount = sale.vatAmount;
            aSale.vatExclusive = sale.vatExclusiveAmount;
            aSale.discountAmount = sale.discountAmount;
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
    }


    getASaleItems(aSale:ASale, saleId:number):Promise<ASale> {
        var itemSaleSearch = new ItemSaleSearch();
        itemSaleSearch.companyRef = this.authService.loggedEmployee.companyRef;
        itemSaleSearch.saleRef = new SaleRef(saleId);
        var authToken = this.authService.authToken;
        var aSaleItemList = [];

        return this.itemSaleClient
            .searchItemSales(itemSaleSearch, null, authToken)
            .then((saleItemsResult)=> {
                return this.updateASaleItemList(aSale, saleItemsResult.list);
            });
    }

    updateASaleItemList(aSale:ASale, itemSaleList:ItemSale[]):Promise<ASale> {
        var oldItemsMap = aSale.itemsMap;
        var newItemsMap:{[itemId: number]: ASaleItem;} = {};
        var toFetchItemTasks:Promise<any>[] = [];

        for (var itemSale of itemSaleList) {
            var itemId = itemSale.itemRef.id;
            var aSaleItem:ASaleItem = oldItemsMap[itemId];
            if (aSaleItem == null) {
                aSaleItem = new ASaleItem();
                aSaleItem.aSale = aSale;
                aSaleItem.discountRate = itemSale.discountRatio;
                aSaleItem.itemId = itemId;
                aSaleItem.itemSaleId = itemSale.id;
                aSaleItem.itemSale = itemSale;
                aSaleItem.quantity = itemSale.quantity;
                aSaleItem.vatExclusive = itemSale.vatExclusive;
                aSaleItem.vatRate = itemSale.vatRate;
                aSaleItem.dirty = true;

                newItemsMap[itemId] = aSaleItem;
                toFetchItemTasks.push(this.getASaleItemItem(aSaleItem)
                    .then((aSaleItem)=> {
                        aSaleItem.dirty = false;
                    }));
                continue;
            }

            var expectedQuantity = aSaleItem.quantity;
            if (expectedQuantity == itemSale.quantity) {
                // In sync with server
                aSaleItem.dirty = false;
                aSaleItem.discountRate = itemSale.discountRatio;
                aSaleItem.itemSale = itemSale;
                aSaleItem.vatExclusive = itemSale.vatExclusive;
                aSaleItem.vatRate = itemSale.vatRate;

                newItemsMap[itemId] = aSaleItem;
                if (aSaleItem.item == null) {
                    aSaleItem.dirty = true;
                    toFetchItemTasks.push(this.getASaleItemItem(aSaleItem)
                        .then((aSaleItem)=> {
                            aSaleItem.dirty = false;
                        }));
                }
            }
        }

        var newItems = [];
        var idKey:string;
        for (idKey in newItemsMap) {
            var itemId:number = parseInt(idKey);
            var saleItem:ASaleItem = newItemsMap[itemId];
            oldItemsMap[itemId] = null;
            newItems.push(saleItem);
        }
        for (idKey in oldItemsMap) {
            var itemId:number = parseInt(idKey);
            var saleItem:ASaleItem = oldItemsMap[itemId];
            if (saleItem != null) {
                console.log("WARNING: A sale item is missing from the fetched list, is it to be removed? itemId:" + idKey);
            }
        }
        aSale.items = newItems;
        aSale.itemsMap = newItemsMap;

        // Fetch items in background
        Promise.all(toFetchItemTasks).then(()=> {

        });
        return new Promise<ASale>((resolve, reject)=> {
            resolve(aSale);
        })
    }

    getASaleItemItem(aSaleItem:ASaleItem):Promise<ASaleItem> {
        var authToken = this.authService.authToken;
        aSaleItem.dirty = true;

        return this.itemClient.getItem(aSaleItem.itemId, authToken)
            .then((item)=> {
                aSaleItem.item = item;
                return aSaleItem;
            });
    }

    openASale(aSale:ASale):Promise<ASale> {
        if (aSale.sale != null) {
            throw 'sale already open';
        }
        aSale.dirty = true;
        var sale = new Sale();
        sale.companyRef = this.authService.loggedEmployee.companyRef;
        return this.createSale(sale)
            .then((saleRef)=> {
                aSale.saleId = saleRef.id;
                sale.id = saleRef.id;
                aSale.sale = sale;
                this.calcASale(aSale);
                aSale.dirty = true;

                // fetch sale in background
                var authToken = this.authService.authToken;
                this.client.getSale(saleRef.id, authToken)
                    .then((sale)=> {
                        aSale.sale = sale;
                        aSale.dirty = false;
                        this.calcASale(aSale);
                    });
                return aSale;
            });
    }

    addItemToASale(aSale:ASale, item:Item):Promise<ASale> {
        if (aSale.sale == null) {
            throw 'sale not open yet';
        }
        if (aSale.sale.closed) {
            throw 'sale closed';
        }
        var authToken = this.authService.authToken;
        aSale.dirty = true;

        var aSaleItem:ASaleItem = aSale.itemsMap[item.id];
        if (aSaleItem == null) {
            aSaleItem = new ASaleItem();
            aSaleItem.aSale = aSale;
            aSaleItem.item = item;
            aSaleItem.quantity = 1;
            aSaleItem.dirty = true;
            aSale.itemsMap[item.id] = aSaleItem;
            aSale.items.push(aSaleItem);

            var itemSale = new ItemSale();
            itemSale.itemRef = new ItemRef(item.id);
            itemSale.saleRef = new SaleRef(aSale.saleId);
            itemSale.quantity = 1;
            this.calcASale(aSale);

            // refetch sale & sale item in background
            this.itemSaleClient
                .createItemSale(itemSale, authToken)
                .then((itemSaleRef)=> {
                    aSaleItem.itemSaleId = itemSaleRef.id;
                    return this.refetchOnASaleItemChanged(aSale, aSaleItem);
                });
            return new Promise<ASale>((resolve, reject)=> {
                resolve(aSale);
            });
        }
        aSaleItem.quantity += 1;
        var itemSale = aSaleItem.itemSale;
        itemSale.quantity = aSaleItem.quantity;
        aSaleItem.dirty = true;
        this.calcASale(aSale);
        // refetch sale & sale item in background
        this.itemSaleClient.updateItemSale(itemSale, authToken)
            .then((itemSaleRef)=> {
                return this.refetchOnASaleItemChanged(aSale, aSaleItem);
            });
        return new Promise<ASale>((resolve, reject)=> {
            resolve(aSale);
        });
    }

    refetchOnASaleItemChanged(aSale:ASale, aSaleItem:ASaleItem):Promise<ASale> {
        var taskList:Promise<any>[] = [];
        var authToken = this.authService.authToken;
        // Fetch sale item
        var itemSaleId = aSaleItem.itemSaleId;
        aSaleItem.dirty = true;
        aSale.dirty = true;
        taskList.push(
            this.itemSaleClient.getItemSale(itemSaleId, authToken)
                .then((itemSale)=> {
                    // Recheck quantity is the same
                    if (itemSale.quantity != aSaleItem.quantity
                        || itemSale.discountRatio != aSaleItem.discountRate) {
                        return;
                    }
                    aSaleItem.itemSale = itemSale;
                    aSaleItem.dirty = false;
                })
        );
        // Fetch sale
        var saleId = aSale.saleId;
        taskList.push(
            this.client.getSale(saleId, authToken)
                .then((sale)=> {
                    aSale.sale = sale;
                    aSale.dirty = false;
                })
        );

        return Promise.all(taskList)
            .then(()=> {
                this.calcASale(aSale);
                return aSale;
            });
    }

    updateASaleItem(aSaleItem:ASaleItem):Promise<ASale> {
        var itemSale = aSaleItem.itemSale;
        var aSale = aSaleItem.aSale;
        var authToken = this.authService.authToken;

        aSale.dirty = true;
        aSaleItem.dirty = true;
        this.calcASale(aSale);

        this.itemSaleClient
            .updateItemSale(itemSale, authToken)
            .then((itemSaleRef)=> {
                aSaleItem.itemSaleId = itemSaleRef.id;
                return this.refetchOnASaleItemChanged(aSale, aSaleItem);
            });
        return new Promise((resolve, reject)=> {
            resolve(aSale);
        });
    }

    removeASaleItem(aSaleItem:ASaleItem):Promise<ASale> {
        var saleItemId = aSaleItem.itemSaleId;
        var aSale = aSaleItem.aSale;
        var saleId = aSale.sale.id;
        var authToken = this.authService.authToken;

        // Remove it locally
        var itemId = aSaleItem.itemId;
        aSale.itemsMap[itemId] = null;
        var newitems = [];
        for (var item of aSale.items) {
            if (item == aSaleItem) {
                continue;
            }
            newitems.push(item);
        }
        aSale.items = newitems;
        aSale.dirty = true;
        this.calcASale(aSale);

        // Refetch sale in background
        this.itemSaleClient.removeItemSale(saleItemId, authToken)
            .then(()=> {
                if (aSale.items.length > 0) {
                    return this.reFetchOnASaleChanged(aSale);
                }
            });


        return new Promise((resolve, reject)=> {
            resolve(aSale);
        });
    }

    setASaleDiscount(aSale:ASale, discountRatio:number):Promise<ASale> {
        var authToken = this.authService.authToken;
        var sale = aSale.sale;
        aSale.discountRate = discountRatio;
        sale.discountRatio = discountRatio;
        aSale.dirty = true;
        this.calcASale(aSale);

        return this.client.updateSale(sale, authToken)
            .then((saleRef)=> {
                return this.client.getSale(saleRef.id, authToken);
            }).then((sale:Sale)=> {
                aSale.sale = sale;
                aSale.dirty = false;
                this.calcASale(aSale);
                return aSale;
            });
    }

    closeASale(aSale:ASale):Promise<ASale> {
        var authToken = this.authService.authToken;
        var saleId = aSale.sale.id;

        return this.client.closeSale(saleId, authToken)
            .then((saleRef)=> {
                return this.client.getSale(saleId, authToken);
            }).then((sale:Sale)=> {
                aSale.sale = sale;
                return aSale;
            });
    }
}