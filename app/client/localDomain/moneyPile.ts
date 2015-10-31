/**
 * Created by cghislai on 08/09/15.
 */

import {MoneyPile} from '../domain/moneyPile';
import {Account, AccountRef, AccountClient, AccountFactory} from '../domain/account';
import {Balance, BalanceRef, BalanceClient, BalanceFactory} from '../domain/balance';

import {LocalAccount, LocalAccountFactory} from './account';
import {LocalBalance, LocalBalanceFactory} from './balance';

import {LocaleTexts, LocaleTextsFactory} from '../utils/lang';

import * as Immutable from 'immutable';

export interface LocalMoneyPile extends Immutable.Map<string, any> {
    id:number;
    account:LocalAccount;
    dateTime:Date;
    unitAmount:number;
    unitCount:number;
    total:number;
    balance:LocalBalance;
    //
    label: LocaleTexts;
}
var MoneyPileRecord = Immutable.Record({
    id: null,
    account: null,
    dateTime: null,
    unitAmount: null,
    unitCount: null,
    total: null,
    balance: null,
    label: null
});
export function NewMoneyPile(desc:any):LocalMoneyPile {
    return <any>MoneyPileRecord(desc);
}

export class LocalMoneyPileFactory {
    static  accountClient = new AccountClient();
    static balanceClient = new BalanceClient();

    static toLocalMoneyPile(moneyPile:MoneyPile, authToken:string):Promise<LocalMoneyPile> {
        var localMoneyPileDesc:any = {};
        localMoneyPileDesc.unitCount = moneyPile.count;
        localMoneyPileDesc.dateTime = moneyPile.dateTime;
        localMoneyPileDesc.id = moneyPile.id;
        localMoneyPileDesc.total = moneyPile.total;
        localMoneyPileDesc.unitAmount = moneyPile.unitAmount;

        var taskList = [];
        var accountRef = moneyPile.accountRef;
        taskList.push(
            LocalMoneyPileFactory.accountClient.getFromCacheOrServer(accountRef.id, authToken)
                .then((account)=> {
                    return LocalAccountFactory.toLocalAccount(account, authToken);
                }).then((localAccount:LocalAccount)=> {
                    localMoneyPileDesc.account = localAccount;
                })
        );
        var balanceRef = moneyPile.balanceRef;
        taskList.push(
            LocalMoneyPileFactory.balanceClient.getFromCacheOrServer(balanceRef.id, authToken)
                .then((balance)=> {
                    return LocalBalanceFactory.toLocalBalance(balance, authToken);
                }).then((localBalance:LocalBalance)=> {
                    localMoneyPileDesc.balance = localBalance;
                })
        );

        return Promise.all(taskList)
            .then(()=> {
               return NewMoneyPile(localMoneyPileDesc);
            });
    }

    static fromLocalMoneyPile(localMoneyPile:LocalMoneyPile):MoneyPile {
        var moneyPile = new MoneyPile();
        moneyPile.accountRef = new AccountRef(localMoneyPile.account.id);
        moneyPile.balanceRef = new BalanceRef(localMoneyPile.balance.id);
        moneyPile.count = localMoneyPile.unitCount;
        moneyPile.dateTime = localMoneyPile.dateTime;
        moneyPile.id = localMoneyPile.id;
        moneyPile.total = localMoneyPile.total;
        moneyPile.unitAmount = localMoneyPile.unitAmount;
        return moneyPile;
    }

    static getCashTypeUnitValue(type:CashType):number {
        switch (type) {
            case CashType.ONE_CENT:
                return 0.01;
            case CashType.TWO_CENT:
                return 0.02;
            case CashType.FIVE_CENT:
                return 0.05;
            case CashType.TEN_CENT:
                return 0.1;
            case CashType.TWENTY_CENT:
                return 0.2;
            case CashType.FIFTY_CENT:
                return 0.5;
            case CashType.ONE_EURO:
                return 1;
            case CashType.TWO_EURO:
                return 2;
            case CashType.FIVE_EURO:
                return 5;
            case CashType.TEN_EURO:
                return 10;
            case CashType.TWENTY_EURO:
                return 20;
            case CashType.FIFTY_EURO:
                return 50;
            case CashType.ONE_HUNDRED_EURO:
                return 100;
            case CashType.TWO_HUNDRED_EURO:
                return 200;
            case CashType.FIVE_HUNDRED_EURO:
                return 500;
        }
        return 0;
    }

    static getCashTypeLabel(type:CashType):LocaleTexts {
        switch (type) {
            case CashType.ONE_CENT:
                return LocaleTextsFactory.toLocaleTexts({'fr': '1 cent'});
            case CashType.TWO_CENT:
                return LocaleTextsFactory.toLocaleTexts({'fr': '2 cent'});
            case CashType.FIVE_CENT:
                return LocaleTextsFactory.toLocaleTexts({'fr': '5 cent'});
            case CashType.TEN_CENT:
                return LocaleTextsFactory.toLocaleTexts({'fr': '10 cent'});
            case CashType.TWENTY_CENT:
                return LocaleTextsFactory.toLocaleTexts({'fr': '20 cent'});
            case CashType.FIFTY_CENT:
                return LocaleTextsFactory.toLocaleTexts({'fr': '50 cent'});
            case CashType.ONE_EURO:
                return LocaleTextsFactory.toLocaleTexts({'fr': '1 euro'});
            case CashType.TWO_EURO:
                return LocaleTextsFactory.toLocaleTexts({'fr': '2 euro'});
            case CashType.FIVE_EURO:
                return LocaleTextsFactory.toLocaleTexts({'fr': '5 euro'});
            case CashType.TEN_EURO:
                return LocaleTextsFactory.toLocaleTexts({'fr': '10 euro'});
            case CashType.TWENTY_EURO:
                return LocaleTextsFactory.toLocaleTexts({'fr': '20 euro'});
            case CashType.FIFTY_EURO:
                return LocaleTextsFactory.toLocaleTexts({'fr': '50 euro'});
            case CashType.ONE_HUNDRED_EURO:
                return LocaleTextsFactory.toLocaleTexts({'fr': '100 euro'});
            case CashType.TWO_HUNDRED_EURO:
                return LocaleTextsFactory.toLocaleTexts({'fr': '200 euro'});
            case CashType.FIVE_HUNDRED_EURO:
                return LocaleTextsFactory.toLocaleTexts({'fr': '500 euro'});
        }
        return LocaleTextsFactory.toLocaleTexts({});
    }
}


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

export var ALL_CASH_TYPES = [
    CashType.FIVE_HUNDRED_EURO,
    CashType.TWO_HUNDRED_EURO,
    CashType.ONE_HUNDRED_EURO,
    CashType.FIFTY_EURO,
    CashType.TWENTY_EURO,
    CashType.TEN_EURO,
    CashType.FIVE_EURO,
    CashType.TWO_EURO,
    CashType.ONE_EURO,
    CashType.FIFTY_CENT,
    CashType.TWENTY_CENT,
    CashType.TEN_CENT,
    CashType.FIVE_CENT,
    CashType.TWO_CENT,
    CashType.ONE_CENT
];