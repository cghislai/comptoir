/**
 * Created by cghislai on 08/09/15.
 */

import {ItemVariantSale} from 'client/domain/itemVariantSale';
import {Sale, SaleRef, SaleClient, SaleFactory} from 'client/domain/sale';
import {ItemVariant, ItemVariantRef, ItemVariantClient, ItemVariantFactory} from 'client/domain/itemVariant';

import {LocalItemVariant, LocalItemVariantFactory} from 'client/localDomain/itemVariant';
import {LocalSale, LocalSaleFactory} from 'client/localDomain/sale';

import {LocaleTexts} from 'client/utils/lang';

import {Map} from 'immutable';

export interface LocalItemVariantSale extends Map<string, any> {
    id:number;
    dateTime:Date;
    quantity:number;
    comment:LocaleTexts;
    vatExclusive:number;
    vatRate:number;
    discountRatio:number;
    total:number;
    itemVariant:LocalItemVariant;
    sale:LocalSale;
}

export class LocalItemVariantSaleFactory {
    static saleClient = new SaleClient();
    static itemVariantClient = new ItemVariantClient();

    static toLocalItemVariantSale(itemSale:ItemVariantSale, authToken:string):Promise<LocalItemVariantSale> {
        var localItemSaleDesc:any = {};
        localItemSaleDesc.comment = itemSale.comment;
        localItemSaleDesc.dateTime = itemSale.dateTime;
        localItemSaleDesc.discountRatio = itemSale.discountRatio;
        localItemSaleDesc.id = itemSale.id;
        localItemSaleDesc.quantity = itemSale.quantity;
        localItemSaleDesc.total = itemSale.total;
        localItemSaleDesc.vatExclusive = itemSale.vatExclusive;
        localItemSaleDesc.vatRate = itemSale.vatRate;

        var taskList = [];

        var itemVariantRef = itemSale.itemVariantRef;
        taskList.push(
            LocalItemVariantSaleFactory.itemVariantClient.getFromCacheOrServer(itemVariantRef.id, authToken)
                .then((itemVariant)=> {
                    return LocalItemVariantFactory.toLocalItemVariant(itemVariant, authToken);
                }).then((localVariant:LocalItemVariant)=> {
                    localItemSaleDesc.itemVariant = localVariant;
                })
        );

        var saleRef = itemSale.saleRef;
        taskList.push(
            LocalItemVariantSaleFactory.saleClient.getFromCacheOrServer(saleRef.id, authToken)
                .then((sale)=> {
                    return LocalSaleFactory.toLocalSale(sale, authToken);
                }).then((localSale:LocalSale)=> {
                    localItemSaleDesc.sale = localSale;
                })
        );

        return Promise.all(taskList)
            .then(()=> {
                var localItemSale:LocalItemVariantSale;
                localItemSale = <LocalItemVariantSale>Map(localItemSaleDesc);
                return localItemSale;
            });
    }

    static fromLocalItemVariantSale(localItemSale:LocalItemVariantSale):ItemVariantSale {
        var itemSale = new ItemVariantSale();
        itemSale.comment = localItemSale.comment;
        itemSale.dateTime = localItemSale.dateTime;
        itemSale.discountRatio = localItemSale.discountRatio;
        itemSale.id = localItemSale.id;
        itemSale.itemVariantRef = new ItemVariantRef(localItemSale.itemVariant.id);
        itemSale.quantity = localItemSale.quantity;
        itemSale.saleRef = new SaleRef(localItemSale.sale.id);
        itemSale.total = localItemSale.total;
        itemSale.vatExclusive = localItemSale.vatExclusive;
        itemSale.vatRate = localItemSale.vatRate;
        return itemSale;
    }

}