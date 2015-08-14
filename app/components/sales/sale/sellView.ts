/**
 * Created by cghislai on 29/07/15.
 */
import {Component, View, NgIf} from 'angular2/angular2';
import {Router, RouteParams, Location} from 'angular2/router';

import {Sale, SaleRef} from 'client/domain/sale';
import {ItemSale, ItemSaleRef, ItemSaleSearch} from 'client/domain/itemSale';
import {Item, ItemRef} from 'client/domain/item';
import {LocaleTexts} from 'client/utils/lang';
import {SearchResult} from 'client/utils/search';
import {SaleService} from 'services/sale';
import {ItemSaleService} from 'services/itemSale';
import {ItemService} from 'services/itemService';
import {ItemListView} from 'components/sales/sale/itemList/listView';
import {CommandView} from 'components/sales/sale/commandView/commandView';
import {PayView} from 'components/sales/sale/payView/payView'


// Our model
export class ActiveSaleItem {
    activeSale:ActiveSale;
    item:Item;
    itemSale:ItemSale;
    reduction:number = 0;
    total:number;
}
export class ActiveSale {
    sale:Sale;
    items:ActiveSaleItem[] = [];
    reduction:number = 0;
    total:number;
}

@Component({
    selector: "sellView",
})
@View({
    templateUrl: "./components/sales/sale/sellView.html",
    styleUrls: ["./components/sales/sale/sellView.css"],
    directives: [ItemListView, CommandView, PayView, NgIf]
})
export class SellView {
    saleService:SaleService;
    itemSaleService:ItemSaleService;
    itemService:ItemService;

    activeSale:ActiveSale;
    payStep:boolean;

    router:Router;
    location:Location;

    constructor(saleService:SaleService, itemSaleService:ItemSaleService, itemService:ItemService,
                router:Router, routeParams:RouteParams, location:Location) {
        this.saleService = saleService;
        this.itemSaleService = itemSaleService;
        this.itemService = itemService;
        this.router = router;
        this.location = location;

        var idValue = routeParams.get('id');
        this.findSale(idValue);
    }


    findSale(idValue:string) {
        this.activeSale = null;
        if (idValue == 'new') {
            this.activeSale = new ActiveSale();
            return;
        }
        var idNumber = parseInt(idValue);
        if (isNaN(idNumber)) {
            this.router.navigate('/sales/sale/new');
            return;
        }
        var thisView = this;
        this.saleService.getSale(idNumber)
            .then((sale:Sale)=> {
                thisView.activeSale = new ActiveSale();
                thisView.activeSale.sale = sale;
                // TODO: fetch the sale items

                var saleSearch = new ItemSaleSearch();
                saleSearch.saleRef = thisView.getActiveSaleRef();
                saleSearch.companyRef = thisView.activeSale.sale.companyRef;

                return thisView.itemSaleService.searchItemSales(saleSearch, null);
            }).then((result:SearchResult<ItemSale>)=> {
                thisView.setSaleItems(result);
            });
    }


    onItemClicked(item:Item, commandView:CommandView, itemList:ItemListView) {
        var thisView = this;
        var isNewSale = this.activeSale.sale == null;
        itemList.focus();
        return this.createSaleIfRequiredAsync()
            .then(()=> {
                return thisView.addSingleItemToSale(item);
            }).then((activeItemSale:ActiveSaleItem)=> {
                if (isNewSale) { // was new sale
                    var activeSaleId = activeItemSale.activeSale.sale.id;
                    this.router.navigate('/sales/sale/' + activeSaleId);
                }
            });
    }


    private createSaleIfRequiredAsync():Promise<Sale> {
        var thisView = this;
        return new Promise<Sale>((resolve, reject)=> {
            var sale = thisView.activeSale.sale;
            if (sale != null) {
                // sale is already createf
                resolve(sale);
                return;
            }
            sale = new Sale();
            return thisView.saleService.createSale(sale)
                .then((saleRef:SaleRef)=> {
                    return thisView.saleService.getSale(saleRef.id);
                }).then((sale:Sale)=> {
                    thisView.activeSale.sale = sale;
                    resolve(sale);
                });
        });
    }

    private addSingleItemToSale(item:Item):Promise<ActiveSaleItem> {
        var activeSale = this.activeSale;
        var activeItemSale = this.getOrCreateItemSale(item);
        var itemSale = activeItemSale.itemSale;
        itemSale.quantity = itemSale.quantity + 1;

        if (itemSale.id != null) {
            return this.itemSaleService.updateItemSale(itemSale)
                .then(()=> {
                    return activeItemSale;
                });
        }
        return this.itemSaleService.createItemSale(itemSale)
            .then((itemSaleref)=> {
                return this.itemSaleService.getItemSale(itemSaleref.id);
            }).then((itemSale=> {
                activeItemSale.itemSale = itemSale;
                return activeItemSale;
            }));
    }


    private getOrCreateItemSale(item:Item):ActiveSaleItem {
        for (var existingItemSale of this.activeSale.items) {
            var exitingItemId = existingItemSale.item.id;
            if (exitingItemId == item.id) {
                return existingItemSale;
            }
        }
        var itemSale = new ItemSale();
        itemSale.saleRef = new SaleRef();
        itemSale.saleRef.id = this.activeSale.sale.id;
        itemSale.itemRef = new ItemRef();
        itemSale.itemRef.id = item.id;
        itemSale.vatExclusive = item.vatExclusive;
        itemSale.vatRate = item.vatRate;
        itemSale.quantity = 0;
        itemSale.comment = new LocaleTexts();
        var activeSaleItem = new ActiveSaleItem();
        activeSaleItem.activeSale = this.activeSale;
        activeSaleItem.itemSale = itemSale;
        activeSaleItem.item = item;
        this.activeSale.items.push(activeSaleItem);
        return activeSaleItem;
    }

    private setSaleItems(result:SearchResult<ItemSale>) {
        var thisView = this;

        var items:ActiveSaleItem[] = [];

        var fetchItemTaskList:Promise<any>[] = [];

        for (var itemSale of result.list) {
            var activeSaleItem = new ActiveSaleItem();
            activeSaleItem.itemSale = itemSale;
            activeSaleItem.activeSale = this.activeSale;
            items.push(activeSaleItem);

            var itemId = itemSale.itemRef.id;
            var fetchItemPromise = this.itemService.getItem(itemId)
                .then((item)=> {
                    activeSaleItem.item = item;
                });
            fetchItemTaskList.push(fetchItemPromise);
        }

        Promise.all(fetchItemTaskList)
            .then(()=> {
                thisView.activeSale.items = items;
            });
    }

    onCommandValidated(validated:boolean, payView:PayView) {
        this.payStep = validated;
        if (validated) {
            payView.calcRemaining();
        }
    }

    onCommandPaid() {
        this.router.navigate('/sales/sale/new')
    }

    getActiveSaleRef():SaleRef {
        var ref = new SaleRef();
        ref.id = this.activeSale.sale.id;
        return ref;
    }
}