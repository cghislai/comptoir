/**
 * Created by cghislai on 15/08/15.
 */
import {Account} from 'client/domain/account';
import {AccountingEntry} from 'client/domain/accountingEntry';
import {Item} from 'client/domain/item';
import {Sale} from 'client/domain/sale';
import {Pos} from 'client/domain/pos';
import {ItemSale} from 'client/domain/itemSale';
import {ComptoirRequest}  from 'client/utils/request';
import {LocaleTexts} from 'client/utils/lang';

export class ASaleItem {
    aSale:ASale;
    item:Item;
    itemSale:ItemSale;

    itemId: number;
    itemSaleId: number;
    quantity: number;
    vatExclusive: number;
    vatRate: number;
    total: number;
    discountRate: number;
    discountPercentage: number;
    comment: LocaleTexts = new LocaleTexts();
    dirty: boolean;

    itemSaleRequest: ComptoirRequest;
    itemRequest: ComptoirRequest;
}

export class ASale {
    sale:Sale;
    items: ASaleItem[] = [];
    itemsMap:any = {}; // [itemId]=item
    saleId: number;
    vatExclusive: number;
    vatAmount: number;
    total: number;
    discountRate: number;
    discountPercentage: number;
    discountAmount: number;
    dirty: boolean;

    saleRequest: ComptoirRequest;
    searchItemsRequest: ComptoirRequest;
}

export class ASalePayItem {
    aSalePay: ASalePay;
    account: Account;
    accountingEntry: AccountingEntry;
    accountingEntryId: number;

    amount: number;
    dirty: boolean;

    entryRequest: ComptoirRequest;
}

export class ASalePay {
    aSale: ASale;
    pos: Pos;
    payItems: ASalePayItem[] = [];

    amount: number = 0;
    missingAmount: number = 0;
    dirty: boolean = false;

    searchItemsRequest: ComptoirRequest;
}


