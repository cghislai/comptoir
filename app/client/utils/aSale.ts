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
}
export class ASale {
    sale:Sale;
    items: ASaleItem[] = [];
    itemsMap:any = {};
}
