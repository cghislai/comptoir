/**
 * Created by cghislai on 08/09/15.
 */

import {ItemVariantSale} from 'client/domain/itemVariantSale';
import {Sale, SaleRef, SaleClient, SaleFactory} from 'client/domain/sale';
import {ItemVariant, ItemVariantRef, ItemVariantClient, ItemVariantFactory} from 'client/domain/itemVariant';

import {LocalItemVariant, LocalItemVariantFactory} from 'client/localDomain/itemVariant';
import {LocalSale, LocalSaleFactory} from 'client/localDomain/sale';

import {LocaleTexts} from 'client/utils/lang';

import {Map, Record} from 'immutable';

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
var ItemVariantSaleRecord = Record({
    id: null,
    dateTime: null,
    quantity: null,
    comment: null,
    vatExclusive: null,
    vatRate: null,
    discountRatio: null,
    total: null,
    itemVariant: null,
    sale: null
});
export function NewItemVariantSale(desc:any):LocalItemVariantSale {
    return <any>ItemVariantSaleRecord(desc);
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
               return NewItemVariantSale(localItemSaleDesc);
            });
    }

    static fromLocalItemVariantSale(localItemSale:LocalItemVariantSale):ItemVariantSale {
        var localItemSaleJS = localItemSale.toJS();
        var itemSale = new ItemVariantSale();
        itemSale.comment = localItemSaleJS.comment;
        itemSale.dateTime = localItemSaleJS.dateTime;
        itemSale.discountRatio = localItemSaleJS.discountRatio;
        itemSale.id = localItemSaleJS.id;
        itemSale.itemVariantRef = new ItemVariantRef(localItemSaleJS.itemVariant.id);
        itemSale.quantity = localItemSaleJS.quantity;
        itemSale.saleRef = new SaleRef(localItemSaleJS.sale.id);
        itemSale.total = localItemSaleJS.total;
        itemSale.vatExclusive = localItemSaleJS.vatExclusive;
        itemSale.vatRate = localItemSaleJS.vatRate;
        return itemSale;
    }

}