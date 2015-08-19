/**
 * Created by cghislai on 19/08/15.
 */

import {Account} from 'client/domain/account';
import {Balance} from 'client/domain/balance';
import {MoneyPile} from 'client/domain/moneyPile';
import {LocaleTexts} from 'client/utils/lang';

export enum CashType {
    ONE_CENT,
    TWO_CENT,
    FIVE_CENT,
    TEN_CENT,
    TWENTY_CENT,
    FIFTY_CENT,
    ONE_EURO,
    TWO_EURO,
    FIVE_EURO,
    TEN_EURO,
    TWENTY_EURO,
    FIFTY_EURO,
    ONE_HUNDRED_EURO,
    TWO_HUNDRED_EURO,
    FIVE_HUNDRED_EURO
}

export class AMoneyPile {
    moneyPile: MoneyPile;
    aBalance: ABalance;

    dirty: boolean = false;
    label: LocaleTexts = new LocaleTexts();
    cashType: CashType;
    total: number = 0;

    constructor(aBalance: ABalance, cashType: CashType, label: string, value: number) {
        this.aBalance = aBalance;
        this.cashType = cashType;
        this.label['fr'] = label;
        this.moneyPile = new MoneyPile();
        this.moneyPile.unitAmount = value;
        this.total = 0;
    }
}

export class ABalance {
    account: Account;
    balance: Balance;
    moneyPilesMap: {[cashType: string]: AMoneyPile} = {};
    moneyPiles: AMoneyPile[];

    dirty: boolean = false;
    total: number = 0;

    constructor() {
        this.moneyPilesMap[CashType[CashType.FIFTY_CENT]]
         = new AMoneyPile(this, CashType.FIFTY_CENT, "50 cent", 0.5);
        this.moneyPilesMap[CashType[CashType.FIFTY_EURO]]
            = new AMoneyPile(this, CashType.FIFTY_EURO, "50 euro", 50);
        this.moneyPilesMap[CashType[CashType.FIVE_CENT]]
            = new AMoneyPile(this, CashType.FIVE_CENT, "5 cent", 0.05);
        this.moneyPilesMap[CashType[CashType.FIVE_EURO]]
            = new AMoneyPile(this, CashType.FIVE_EURO, "5 euro", 5);
        this.moneyPilesMap[CashType[CashType.FIVE_HUNDRED_EURO]]
            = new AMoneyPile(this, CashType.FIVE_HUNDRED_EURO, "500 euro", 500);
        this.moneyPilesMap[CashType[CashType.ONE_CENT]]
            = new AMoneyPile(this, CashType.ONE_CENT, "1 cent", 0.01);
        this.moneyPilesMap[CashType[CashType.ONE_EURO]]
            = new AMoneyPile(this, CashType.ONE_EURO, "1 euro", 1);
        this.moneyPilesMap[CashType[CashType.ONE_HUNDRED_EURO]]
            = new AMoneyPile(this, CashType.ONE_HUNDRED_EURO, "100 euro", 100);
        this.moneyPilesMap[CashType[CashType.TEN_CENT]]
            = new AMoneyPile(this, CashType.TEN_CENT, "10 cent", 0.1);
        this.moneyPilesMap[CashType[CashType.TEN_EURO]]
            = new AMoneyPile(this, CashType.TEN_EURO, "10 euro", 10);
        this.moneyPilesMap[CashType[CashType.TWENTY_CENT]]
            = new AMoneyPile(this, CashType.TWENTY_CENT, "20 cent", 0.2);
        this.moneyPilesMap[CashType[CashType.TWENTY_EURO]]
            = new AMoneyPile(this, CashType.TWENTY_EURO, "20 euro", 20);
        this.moneyPilesMap[CashType[CashType.TWO_CENT]]
            = new AMoneyPile(this, CashType.TWO_CENT, "2 cent", 0.02);
        this.moneyPilesMap[CashType[CashType.TWO_EURO]]
            = new AMoneyPile(this, CashType.TWO_EURO, "2 euro", 2);
        this.moneyPilesMap[CashType[CashType.TWO_HUNDRED_EURO]]
            = new AMoneyPile(this, CashType.TWO_HUNDRED_EURO, "200 euro", 200);

        this.moneyPiles = [
          this.moneyPilesMap[CashType[CashType.FIVE_HUNDRED_EURO]],
            this.moneyPilesMap[CashType[CashType.TWO_HUNDRED_EURO]],
            this.moneyPilesMap[CashType[CashType.ONE_HUNDRED_EURO]],
            this.moneyPilesMap[CashType[CashType.FIFTY_EURO]],
            this.moneyPilesMap[CashType[CashType.TWENTY_EURO]],
            this.moneyPilesMap[CashType[CashType.TEN_EURO]],
            this.moneyPilesMap[CashType[CashType.FIVE_EURO]],
            this.moneyPilesMap[CashType[CashType.TWO_EURO]],
            this.moneyPilesMap[CashType[CashType.ONE_EURO]],
            this.moneyPilesMap[CashType[CashType.FIFTY_CENT]],
            this.moneyPilesMap[CashType[CashType.TWENTY_CENT]],
            this.moneyPilesMap[CashType[CashType.TEN_CENT]],
            this.moneyPilesMap[CashType[CashType.FIVE_CENT]],
            this.moneyPilesMap[CashType[CashType.TWO_CENT]],
            this.moneyPilesMap[CashType[CashType.ONE_CENT]]
        ];
    }
}