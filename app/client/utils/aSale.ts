/**
 * Created by cghislai on 15/08/15.
 */
import {Account} from 'client/domain/account';
import {AccountingEntry} from 'client/domain/accountingEntry';
import {Item} from 'client/domain/item';
import {Sale} from 'client/domain/sale';
import {Pos} from 'client/domain/pos';
import {ItemSale} from 'client/domain/itemSale';

export class ASaleItem {
    aSale:ASale;
    item:Item;
    itemSale:ItemSale;

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
    payList: ASalePay[];
    saleId: number;
    vatExclusive: number;
    vatAmount: number;
    discountRate: number;
    discountPercentage: number;
    discountAmount: number;
    dirty: boolean;
}

export class ASalePayItem {
    aSalePay: ASalePay;
    account: Account;
    accountingEntry: AccountingEntry;

    amount: number;
    dirty: boolean;
    addedToPay: boolean = false;
}

export class ASalePay {
    aSale: ASale;
    pos: Pos;
    payItems: ASalePayItem[] = [];

    amount: number = 0;
    missingAmount: number = 0;
    dirty: boolean = false;
}


