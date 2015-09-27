/**
 * Created by cghislai on 08/09/15.
 */

import {ItemVariantSale} from 'client/domain/itemVariantSale';
import {Sale, SaleRef, SaleClient, SaleFactory} from 'client/domain/sale';
import {ItemVariant, ItemVariantRef, ItemVariantClient, ItemVariantFactory} from 'client/domain/itemVariant';

import {LocalItemVariant, LocalItemVariantFactory} from 'client/localDomain/itemVariant';
import {LocalSale, LocalSaleFactory} from 'client/localDomain/sale';

import {LocaleTexts} from 'client/utils/lang';

export class LocalItemVariantSale {
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
        var localItemSale = new LocalItemVariantSale();
        return LocalItemVariantSaleFactory.updateLocalItemVariantSale(localItemSale, itemSale, authToken);
    }

    static updateLocalItemVariantSale(localItemSale:LocalItemVariantSale,
                                      itemSale:ItemVariantSale, authToken:string):Promise<LocalItemVariantSale> {
        localItemSale.comment = itemSale.comment;
        localItemSale.dateTime = itemSale.dateTime;
        localItemSale.discountRatio = itemSale.discountRatio;
        localItemSale.id = itemSale.id;
        localItemSale.quantity = itemSale.quantity;
        localItemSale.total = itemSale.total;
        localItemSale.vatExclusive = itemSale.vatExclusive;
        localItemSale.vatRate = itemSale.vatRate;

        var taskList = [];

        var itemVariantRef = itemSale.itemVariantRef;
        taskList.push(
            LocalItemVariantSaleFactory.itemVariantClient.getFromCacheOrServer(itemVariantRef.id, authToken)
                .then((itemVariant)=> {
                    return LocalItemVariantFactory.toLocalItemVariant(itemVariant, authToken);
                }).then((localVariant:LocalItemVariant)=> {
                    localItemSale.itemVariant = localVariant;
                })
        );

        var saleRef = itemSale.saleRef;
        taskList.push(
            LocalItemVariantSaleFactory.saleClient.getFromCacheOrServer(saleRef.id, authToken)
                .then((sale)=> {
                    return LocalSaleFactory.toLocalSale(sale, authToken);
                }).then((localSale: LocalSale)=> {
                    localItemSale.sale = localSale;
                })
        );

        return Promise.all(taskList)
            .then(()=> {
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