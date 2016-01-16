/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from 'angular2/core';

import {ItemVariantSale, ItemVariantSaleRef, ItemVariantSaleSearch, ItemVariantSaleFactory} from '../client/domain/itemVariantSale';
import {ItemVariantRef} from '../client/domain/itemVariant';
import {SaleRef} from '../client/domain/sale';

import {LocalItemVariantSale, LocalItemVariantSaleFactory} from '../client/localDomain/itemVariantSale';
import {LocalAccount} from '../client/localDomain/account';

import {WithId} from '../client/utils/withId';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {ItemVariantSaleClient} from '../client/itemVariantSale';

import {AuthService} from './auth';
import {ItemVariantService} from './itemVariant';
import {SaleService} from './sale';

@Injectable()
export class ItemVariantSaleService {
    private itemVariantSaleClient:ItemVariantSaleClient;
    private authService:AuthService;
    private itemVariantService:ItemVariantService;
    private saleService:SaleService;


    constructor(itemVariantSaleClient:ItemVariantSaleClient,
                authService:AuthService,
                itemVariantService:ItemVariantService,
                saleService:SaleService) {
        this.itemVariantSaleClient = itemVariantSaleClient;
        this.authService = authService;
        this.itemVariantService = itemVariantService;
        this.saleService = saleService;
    }


    fetch(id:number):Promise<LocalItemVariantSale> {
        return this.itemVariantSaleClient.doFetch(id, this.getAuthToken())
            .toPromise()
            .then((entity:ItemVariantSale)=> {
                return this.toLocalConverter(entity);
            });
    }

    get(id:number):Promise<LocalItemVariantSale> {
        return this.itemVariantSaleClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:ItemVariantSale)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.itemVariantSaleClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalItemVariantSale):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.itemVariantSaleClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalItemVariantSale>):Promise<SearchResult<LocalItemVariantSale>> {
        return this.itemVariantSaleClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<ItemVariantSale>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalItemVariantSale>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(itemVariantSale:ItemVariantSale):Promise<LocalItemVariantSale> {
        var localItemSaleDesc:any = {};
        localItemSaleDesc.comment = itemVariantSale.comment;
        localItemSaleDesc.dateTime = itemVariantSale.dateTime;
        localItemSaleDesc.discountRatio = itemVariantSale.discountRatio;
        localItemSaleDesc.id = itemVariantSale.id;
        localItemSaleDesc.quantity = itemVariantSale.quantity;
        localItemSaleDesc.total = itemVariantSale.total;
        localItemSaleDesc.vatExclusive = itemVariantSale.vatExclusive;
        localItemSaleDesc.vatRate = itemVariantSale.vatRate;

        var taskList = [];

        var itemVariantRef = itemVariantSale.itemVariantRef;
        taskList.push(
            this.itemVariantService.get(itemVariantRef.id)
                .then((localVariant)=> {
                    localItemSaleDesc.itemVariant = localVariant;
                })
        );

        var saleRef = itemVariantSale.saleRef;
        taskList.push(
            this.saleService.get(saleRef.id)
                .then((localSale)=> {
                    localItemSaleDesc.sale = localSale;
                })
        );

        return Promise.all(taskList)
            .then(()=> {
                return LocalItemVariantSaleFactory.createNewItemVariantSale(localItemSaleDesc);
            });
    }

    fromLocalConverter(localItemVariantSale:LocalItemVariantSale):ItemVariantSale {
        var itemSale = new ItemVariantSale();
        itemSale.comment = localItemVariantSale.comment;
        itemSale.dateTime = localItemVariantSale.dateTime;
        itemSale.discountRatio = localItemVariantSale.discountRatio;
        itemSale.id = localItemVariantSale.id;
        itemSale.itemVariantRef = new ItemVariantRef(localItemVariantSale.itemVariant.id);
        itemSale.quantity = localItemVariantSale.quantity;
        itemSale.saleRef = new SaleRef(localItemVariantSale.sale.id);
        itemSale.total = localItemVariantSale.total;
        itemSale.vatExclusive = localItemVariantSale.vatExclusive;
        itemSale.vatRate = localItemVariantSale.vatRate;
        return itemSale;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}