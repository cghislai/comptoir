/**
 * Created by cghislai on 22/09/15.
 */

import {Inject, LifeCycle} from 'angular2/angular2';

import {CompanyRef} from 'client/domain/company';
import {Sale, SaleRef, SaleClient} from 'client/domain/sale';
import {ItemVariantSale, ItemVariantSaleClient, ItemVariantSaleSearch} from 'client/domain/itemVariantSale';
import {Pos} from 'client/domain/pos';

import {LocalSale, LocalSaleFactory} from 'client/localDomain/sale';
import {LocalItemVariant} from 'client/localDomain/itemVariant';
import {LocalItemVariantSale, LocalItemVariantSaleFactory} from 'client/localDomain/itemVariantSale';

import {SearchRequest, SearchResult} from 'client/utils/search';
import {LocaleTexts} from 'client/utils/lang';

import {AuthService} from 'services/auth';
import {SaleService } from 'services/sale';
import {BasicLocalService, BasicLocalServiceInfo} from 'services/basicService';

export class ActiveSaleService {
    lifecycle:LifeCycle;
    sale:LocalSale;
    pos:Pos;
    payStep:boolean;
    saleItemsRequest:SearchRequest<LocalItemVariantSale>;
    saleItemsResult:SearchResult<LocalItemVariantSale>;

    authService:AuthService;
    saleClient:SaleClient;
    saleService:BasicLocalService<Sale, LocalSale>;
    itemVariantSaleService:BasicLocalService<ItemVariantSale, LocalItemVariantSale>;

    constructor(@Inject authService:AuthService, @Inject lifecycle:LifeCycle) {
        this.sale = null;
        this.pos = null;
        this.lifecycle = lifecycle;

        this.saleItemsRequest = new SearchRequest<LocalItemVariantSale>();
        var search = new ItemVariantSaleSearch();
        search.companyRef = new CompanyRef(authService.auth.employee.company.id);
        this.saleItemsRequest.search = search;

        this.saleItemsResult = new SearchResult<LocalItemVariantSale>();

        this.saleItemsResult = new SearchResult<LocalItemVariantSale>();
        this.saleItemsResult.count = 0;
        this.saleItemsResult.list = [];


        this.authService = authService;
        this.saleClient = new SaleClient();
        var saleServiceInfo:BasicLocalServiceInfo<Sale, LocalSale> = <BasicLocalServiceInfo<Sale, LocalSale>>{
            client: this.saleClient,
            authService: authService,
            fromLocalConverter: LocalSaleFactory.fromLocalSale,
            toLocalConverter: LocalSaleFactory.toLocalSale,
            updateLocal: LocalSaleFactory.updateLocalSale
        };
        this.saleService = new BasicLocalService<Sale, LocalSale>(saleServiceInfo);

        var itemVariantSaleServiceInfo:BasicLocalServiceInfo<ItemVariantSale, LocalItemVariantSale> = <BasicLocalServiceInfo<ItemVariantSale, LocalItemVariantSale>>{
            client: new ItemVariantSaleClient(),
            authService: authService,
            fromLocalConverter: LocalItemVariantSaleFactory.fromLocalItemVariantSale,
            toLocalConverter: LocalItemVariantSaleFactory.toLocalItemVariantSale,
            updateLocal: LocalItemVariantSaleFactory.updateLocalItemVariantSale
        };
        this.itemVariantSaleService = new BasicLocalService<ItemVariantSale, LocalItemVariantSale>(itemVariantSaleServiceInfo);
    }

    public getSale(id:number):Promise<LocalSale> {
        return this.saleService.get(id)
            .then((sale)=> {
                return this.setSale(sale);
            })
            .then((sale) => {
                return this.doSearchSaleItems();
            })
            .then((result)=> {
                this.saleItemsResult = result;
                return this.sale;
            });
    }

    public getNewSale():Promise<LocalSale> {
        return Promise.resolve(new LocalSale())
            .then((sale)=> {
                return this.setSale(sale);
            });
    }

    public getActiveSale():Promise<LocalSale> {
        if (this.sale == null) {
            return this.getNewSale();
        } else {
            return Promise.resolve(this.sale);
        }
    }

    private setSale(sale:LocalSale):Promise<LocalSale> {
        if (sale == null) {
            return this.getNewSale();
        }
        var curSale = this.sale;
        this.sale = sale;
        if (curSale != null && curSale.id == sale.id) {
            this.lifecycle.tick();
            return Promise.resolve(sale);
        }
    }

    public doCancelSale():Promise<any> {
        return this.saleService.remove(this.sale).then(()=> {
            this.lifecycle.tick();
        });
    }

    public doSaveSale():Promise<LocalSale> {
        this.sale.company = this.authService.auth.employee.company;
        this.sale.discountRatio = 0;

        return this.saleService.save(this.sale)
            .then((ref)=> {
                return this.saleService.get(ref.id);
            }).then((sale:LocalSale)=> {
                return this.setSale(sale);
            });
    }


    public doCloseSale() {
        if (this.sale == null) {
            throw 'no sale';
        }
        if (this.sale.id == null) {
            throw 'Sale not saved';
        }
        var authToken = this.authService.authToken;
        return this.saleClient.closeSale(this.sale.id, authToken)
            ;
    }

    private updateSale(sale: LocalSale) {
        this.sale.discountAmount = sale.discountAmount;
        this.sale.vatAmount = sale.vatAmount;
        this.sale.vatExclusiveAmount = sale.vatExclusiveAmount;
    }

    private updateSaleItem(saleItem: LocalItemVariantSale, fetchedItem: LocalItemVariantSale) {
        saleItem.total = fetchedItem.total;
    }

    public fetchSaleAndItem(item:LocalItemVariantSale):Promise<any[]> {
        var taskList:Promise<any>[] = <Promise<any>[]>[
            this.saleService.get(this.sale.id).then((sale)=> {
               this.updateSale(sale);
            }),
            this.itemVariantSaleService.get(item.id)
                .then((fetchedItem)=> {
                    this.updateSaleItem(item, fetchedItem);
                })
        ];
        return Promise.all(taskList);
    }

    public doAddItem(itemVariant:LocalItemVariant):Promise<any> {
        if (this.sale == null) {
            throw 'no sale';
        }
        if (this.sale.id == null) {
            throw 'Sale not saved';
        }


        var itemSale:LocalItemVariantSale = null;
        for (var existingItemSale of this.saleItemsResult.list) {
            if (existingItemSale.itemVariant.id == itemVariant.id) {
                itemSale = existingItemSale;
                break;
            }
        }
        var newItem = itemSale == null;
        if (newItem) {
            itemSale = new LocalItemVariantSale();
            itemSale.comment = new LocaleTexts();
            itemSale.discountRatio = 0;
            itemSale.itemVariant = itemVariant;
            itemSale.quantity = 1;
            itemSale.sale = this.sale;
            itemSale.vatExclusive = itemVariant.calcPrice(false);
            itemSale.vatRate = itemVariant.item.vatRate;
            if (this.saleItemsResult != null) {
                this.saleItemsResult.list.push(itemSale);
                this.saleItemsResult.count++;
            }
        } else {
            itemSale.quantity += 1;
        }

        return this.itemVariantSaleService.save(itemSale)
            .then((ref)=> {
                itemSale.id = ref.id;
                return this.fetchSaleAndItem(itemSale);
            });
    }

    public doRemoveItem(saleItem:LocalItemVariantSale):Promise<any> {
        var newItems:LocalItemVariantSale[] = [];
        for (var existingItemSale of this.saleItemsResult.list) {
            if (existingItemSale == saleItem) {
                continue
            }
            newItems.push(existingItemSale);
        }
        this.saleItemsResult.list = newItems;

        return this.itemVariantSaleService.remove(saleItem)
            .then(()=> {
                var taskList:Promise<any>[] = [
                    this.saleService.get(this.sale.id).then((sale)=>{
                        this.updateSale(sale);
                    }),
                    this.doSearchSaleItems().then((result)=>{
                        this.saleItemsResult = result;
                    })
                ];
                return Promise.all(taskList);
            });
    }

    public doUpdateItem(saleItem:LocalItemVariantSale):Promise<any> {
        return this.itemVariantSaleService.save(saleItem)
            .then((ref)=> {
                saleItem.id = ref.id;
                return this.fetchSaleAndItem(saleItem);
            })
    }

    public doUpdateSale():Promise<any> {
        return this.saleService.save(this.sale)
            .then((ref)=> {
                return this.saleService.get(ref.id);
            })
            .then((sale:LocalSale)=> {
                this.updateSale(sale);
            });
    }


    doSearchSaleItems() {
        if (this.sale == null) {
            throw 'no sale';
        }
        if (this.sale.id == null) {
            throw 'Sale not saved';
        }
        var search = this.saleItemsRequest.search;
        var saleRef = new SaleRef(this.sale.id);
        search.saleRef = saleRef;
        return this.itemVariantSaleService.search(this.saleItemsRequest, this.saleItemsResult);
    }


}