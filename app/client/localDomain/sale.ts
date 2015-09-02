/**
 * Created by cghislai on 01/09/15.
 */

import {LocalItem} from 'client/localDomain/item';
import {LocalPicture} from 'client/localDomain/picture';
import {LocalItemVariant, LocalItemVariantFactory} from 'client/localDomain/itemvariant';
import {LocalAccountingEntry} from 'client/localDomain/accountingEntry';

import {CompanyRef} from 'client/domain/company';
import {CustomerRef} from 'client/domain/customer';
import {InvoiceRef} from 'client/domain/invoice';
import {AccountingTransactionRef} from 'client/domain/accountingTransaction'


import {Account} from 'client/domain/account';
import {ItemVariant, ItemVariantRef} from 'client/domain/itemVariant';
import {Sale, SaleRef} from 'client/domain/sale';
import {Pos} from 'client/domain/pos';
import {ItemSale} from 'client/domain/itemSale';
import {ComptoirRequest}  from 'client/utils/request';
import {LocaleTexts} from 'client/utils/lang';


export class LocalItemSale {
    id:number;
    dateTime:Date;
    quantity:number;
    comment:LocaleTexts;
    vatExclusive:number;
    vatRate:number;
    discountRatio:number;
    total:number;

    itemSaleRequest: ComptoirRequest;

    itemVariant:LocalItemVariant;
    itemVariantRequest:ComptoirRequest;

    sale:LocalSale;
    dirty: boolean;
}

export class LocalSale {
    id:number;
    companyRef:CompanyRef;
    customerRef:CustomerRef;
    dateTime:Date;
    invoiceRef:InvoiceRef;
    vatExclusiveAmount:number;
    vatAmount:number;
    closed:boolean;
    reference:string;
    accountingTransactionRef:AccountingTransactionRef;
    discountRatio:number;
    discountAmount:number;

    saleRequest: ComptoirRequest;

    items:LocalItemSale[];
    itemsRequest:ComptoirRequest;

    totalPaid: number;
    totalPaidRequest: ComptoirRequest;

    accountingEntries: LocalAccountingEntry[];
    accountingEntriesRequest: ComptoirRequest;

    dirty:boolean;
}

export class LocalSaleFactory {

    static fromLocalSale(localSale:LocalSale) {
        var sale = new Sale();
        sale.id = localSale.id;
        sale.accountingTransactionRef = localSale.accountingTransactionRef;
        sale.closed = localSale.closed;
        sale.companyRef = localSale.companyRef;
        sale.customerRef = localSale.customerRef;
        sale.dateTime = localSale.dateTime;
        sale.discountAmount = localSale.discountAmount;
        sale.discountRatio = localSale.discountRatio;
        sale.invoiceRef = localSale.invoiceRef;
        sale.reference = localSale.reference;
        sale.vatAmount = localSale.vatAmount;
        sale.vatExclusiveAmount = localSale.vatExclusiveAmount;
    }

    static toLocalSale(sale:Sale) {
        var localSale = new LocalSale();
        LocalSaleFactory.updateLocalSale(localSale, sale);
        return localSale;
    }

    static updateLocalSale(localSale:LocalSale, sale:Sale) {
        localSale.id = sale.id;

        localSale.accountingTransactionRef = sale.accountingTransactionRef;
        localSale.closed = sale.closed;
        localSale.companyRef = sale.companyRef;
        localSale.customerRef = sale.customerRef;
        localSale.dateTime = sale.dateTime;
        localSale.discountAmount = sale.discountAmount;
        localSale.discountRatio = sale.discountRatio;
        localSale.invoiceRef = sale.invoiceRef;
        localSale.reference = sale.reference;
        localSale.vatAmount = sale.vatAmount;
        localSale.vatExclusiveAmount = sale.vatExclusiveAmount;

        localSale.items = [];
    }

    static fromLocalItemSale(localItemSale:LocalItemSale):ItemSale {
        var itemSale = new ItemSale();
        itemSale.comment = localItemSale.comment;
        itemSale.dateTime = localItemSale.dateTime;
        itemSale.discountRatio = localItemSale.discountRatio;
        itemSale.id = localItemSale.id;
        itemSale.itemVariantRef = new ItemVariantRef(localItemSale.id);
        itemSale.quantity = localItemSale.quantity;
        itemSale.saleRef = new SaleRef(localItemSale.sale.id);
        itemSale.total = localItemSale.total;
        itemSale.vatExclusive = localItemSale.vatExclusive;
        itemSale.vatRate = localItemSale.vatRate;
        return itemSale;
    }

    static toLocalItemSale(itemSale:ItemSale):LocalItemSale {
        var localItemSale = new LocalItemSale();
        LocalSaleFactory.updateLocalItemSale(localItemSale, itemSale);
        return localItemSale;
    }

    static updateLocalItemSale(localItemSale:LocalItemSale, itemSale:ItemSale) {
        localItemSale.comment = itemSale.comment;
        localItemSale.dateTime = itemSale.dateTime;
        localItemSale.discountRatio = itemSale.discountRatio;
        localItemSale.id = itemSale.id;
        localItemSale.quantity = itemSale.quantity;
        localItemSale.total = itemSale.total;
        localItemSale.vatExclusive = itemSale.vatExclusive;
        localItemSale.vatRate = itemSale.vatRate;
        return localItemSale;
    }
}