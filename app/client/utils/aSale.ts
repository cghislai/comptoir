/**
 * Created by cghislai on 15/08/15.
 */
import {Item} from 'client/domain/item';
import {Sale} from 'client/domain/sale';
import {ItemSale} from 'client/domain/itemSale';

export class ASaleItem {
    aSale:ASale;
    item:Item;
    itemSale:ItemSale;

    // local fields
    itemId: number;
    itemSaleId: number;
    quantity: number;
    vatExclusive: number;
    vatRate: number;
    discountRate: number;
    discountPercentage: number;
    dirty: boolean;
}


export class ASale {
    sale:Sale;
    items: ASaleItem[] = [];
    itemsMap:any = {}; // [itemId]=item

    // local fields
    saleId: number;
    vatExclusive: number;
    vatAmount: number;
    discountRate: number;
    discountPercentage: number;
    discountAmount: number;
    dirty: boolean;
}
