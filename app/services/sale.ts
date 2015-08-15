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
    itemClient: ItemClient;
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

    getASale(saleId:number):Promise<ASale> {
        var aSale:ASale = new ASale();
        var taskList:Promise<any>[] = [
            this.getSale(saleId)
                .then((sale)=> {
                    aSale.sale = sale;
                })
            ,
            this.getASaleItems(aSale, saleId)
        ];

        return Promise.all(taskList)
            .then(()=> {
                return aSale;
            });
    }

    getASaleItems(aSale:ASale, saleId:number):Promise<ASale> {
        var aSaleItemList = [];
        var itemSaleSearch = new ItemSaleSearch();
        itemSaleSearch.companyRef = this.authService.loggedEmployee.companyRef;
        itemSaleSearch.saleRef = new SaleRef(saleId);
        var authToken = this.authService.authToken;
        return this.itemSaleClient
            .searchItemSales(itemSaleSearch, null, authToken)
            .then((saleItemsResult)=> {
                var itemTasks = [];
                for (var saleItem of saleItemsResult.list) {
                    itemTasks.push(this.createASaleItem(saleItem)
                            .then((aSaleItem)=> {
                                aSaleItem.aSale = aSale;
                                aSaleItemList.push(aSaleItem);
                            })
                    );
                }
                return Promise.all(itemTasks);
            }).then(()=> {
                aSale.items = aSaleItemList;
                for (var aSaleItem of aSaleItemList ) {
                    aSale.itemsMap[aSaleItem.item.id] = aSaleItem;
                }
                return aSale;
            });
    }

    createASaleItem(saleItem:ItemSale):Promise<ASaleItem> {
        var aSaleItem = new ASaleItem();
        aSaleItem.itemSale = saleItem;
        var authToken = this.authService.authToken;
        return this.itemClient.getItem(saleItem.itemRef.id, authToken)
            .then((item)=> {
                aSaleItem.item = item;
                return aSaleItem;
            });
    }

    openASale(aSale:ASale):Promise<ASale> {
        if (aSale.sale != null) {
            throw 'sale already open';
        }
        var sale = new Sale();
        sale.companyRef = this.authService.loggedEmployee.companyRef;
        return this.createSale(sale)
            .then((saleRef)=> {
                sale.id = saleRef.id;
                aSale.sale = sale;
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
        var aSaleItem:ASaleItem = aSale.itemsMap[item.id];
        if (aSaleItem == null) {
            aSaleItem = new ASaleItem();
            aSaleItem.aSale = aSale;
            aSaleItem.item = item;

            var itemSale = new ItemSale();
            itemSale.itemRef = new ItemRef(item.id);
            itemSale.saleRef = new SaleRef(aSale.sale.id);
            itemSale.quantity = 0;

            return this.itemSaleClient
                .createItemSale(itemSale, authToken)
                .then((itemSaleRef)=> {
                    return this.itemSaleClient.getItemSale(itemSaleRef.id, authToken);
                }).then((updatedItemSale:ItemSale)=> {
                    aSaleItem.itemSale = updatedItemSale;
                    aSale.itemsMap[item.id] = aSaleItem;
                    aSale.items.push(aSaleItem);
                    return this.addItemToASale(aSale, item);
                });
        }
        var itemSale = aSaleItem.itemSale;
        itemSale.quantity = itemSale.quantity + 1;
        return this.updateASaleItem(aSaleItem);

    }

    updateASaleItem(aSaleItem:ASaleItem):Promise<ASale> {
        var itemSale = aSaleItem.itemSale;
        var aSale = aSaleItem.aSale;
        var authToken = this.authService.authToken;

        return this.itemSaleClient
            .updateItemSale(itemSale, authToken)
            .then((itemSaleRef)=> {
                //  fetch itemSale and sale concurrently
                var searchTasks:Promise<any>[] = [];
                var saleId = aSale.sale.id;

                var searchItemSaleTask = this.itemSaleClient
                    .getItemSale(itemSaleRef.id, authToken)
                    .then((updatedSaleItem:ItemSale)=> {
                        aSaleItem.itemSale = updatedSaleItem;
                    });
                var searchSaleTask = this.getSale(saleId)
                    .then((updatedSale:Sale)=> {
                        aSale.sale = updatedSale;
                    });
                searchTasks.push(searchItemSaleTask);
                searchTasks.push(searchSaleTask);
                return Promise.all(searchTasks);
            }).then(()=> {
                return aSale;
            });
    }

    removeASaleItem(aSaleItem:ASaleItem):Promise<ASale> {
        var saleItemId = aSaleItem.itemSale.id;
        var aSale = aSaleItem.aSale;
        var saleId = aSale.sale.id;
        var authToken = this.authService.authToken;

        return this.itemSaleClient.removeItemSale(saleItemId, authToken)
            .then(()=> {
                var itemId = aSaleItem.item.id;
                aSale.itemsMap[itemId] = null;
                var newItems = [];
                for (var item of aSale.itemsMap) {
                    newItems.push(item);
                }
                aSale.items = newItems;
                aSaleItem = null;

                return this.getSale(saleId);
            }).then((sale:Sale)=> {
                aSale.sale = sale;
                return aSale;
            });
    }

}