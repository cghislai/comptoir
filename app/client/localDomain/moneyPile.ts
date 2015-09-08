/**
 * Created by cghislai on 08/09/15.
 */

import {MoneyPile} from 'client/domain/moneyPile';
import {Account, AccountRef, AccountClient, AccountFactory} from 'client/domain/account';
import {Balance, BalanceRef, BalanceClient, BalanceFactory} from 'client/domain/balance';
import {LocalAccount, LocalAccountFactory} from 'client/localDomain/account';
import {LocalBalance, LocalBalanceFactory} from 'client/localDomain/balance';
import {LocaleTexts} from 'client/utils/lang';

export class LocalMoneyPile {
    id:number;
    account:LocalAccount;
    dateTime:Date;
    unitAmount:number;
    count:number;
    total:number;
    balance:LocalBalance;

    //
    label: LocaleTexts;
}

export class LocalMoneyPileFactory {

    static toLocalMoneyPile(moneyPile:MoneyPile, authToken:string):Promise<LocalMoneyPile> {
        var localMoneyPile = new LocalMoneyPile();
        return LocalMoneyPileFactory.updateLocalMoneyPile(localMoneyPile, moneyPile, authToken);
    }

    static updateLocalMoneyPile(localMoneyPile:LocalMoneyPile, moneyPile:MoneyPile, authToken:string):Promise<LocalMoneyPile> {
        localMoneyPile.count = moneyPile.count;
        localMoneyPile.dateTime = moneyPile.dateTime;
        localMoneyPile.id = moneyPile.id;
        localMoneyPile.total = moneyPile.total;
        localMoneyPile.unitAmount = moneyPile.unitAmount;

        var taskList = [];
        var accountRef = moneyPile.accountRef;
        var accountClient = new AccountClient();
        taskList.push(
            accountClient.getFromCacheOrServer(accountRef.id, authToken)
                .then((account)=> {
                    return LocalAccountFactory.toLocalAccount(account, authToken);
                }).then((localAccount:LocalAccount)=> {
                    localMoneyPile.account = localAccount;
                })
        );
        var balanceRef = moneyPile.balanceRef;
        var balanceClient = new BalanceClient();
        taskList.push(
            balanceClient.getFromCacheOrServer(balanceRef.id, authToken)
                .then((balance)=> {
                    return LocalBalanceFactory.toLocalBalance(balance, authToken);
                }).then((localBalance:LocalBalance)=> {
                    localMoneyPile.balance = localBalance;
                })
        );

        return Promise.all(taskList)
            .then(()=> {
                return localMoneyPile;
            });
    }

    static fromLocalMoneyPile(localMoneyPile:LocalMoneyPile):MoneyPile {
        var moneyPile = new MoneyPile();
        moneyPile.accountRef = new AccountRef(localMoneyPile.account.id);
        moneyPile.balanceRef = new BalanceRef(localMoneyPile.balance.id);
        moneyPile.count = localMoneyPile.count;
        moneyPile.dateTime = localMoneyPile.dateTime;
        moneyPile.id = localMoneyPile.id;
        moneyPile.total = localMoneyPile.total;
        moneyPile.unitAmount = localMoneyPile.unitAmount;
        return moneyPile;
    }

    static getCashTypeUnitValue(type:CashType): number {
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
    static getCashTypeLabel(type:CashType): LocaleTexts {
        switch (type) {
            case CashType.ONE_CENT:
                return {'fr': '1 cent'};
            case CashType.TWO_CENT:
                return {'fr': '2 cent'};
            case CashType.FIVE_CENT:
                return {'fr': '5 cent'};
            case CashType.TEN_CENT:
                return {'fr': '10 cent'};
            case CashType.TWENTY_CENT:
                return {'fr': '30 cent'};
            case CashType.FIFTY_CENT:
                return {'fr': '50 cent'};
            case CashType.ONE_EURO:
                return {'fr': '1 euro'};
            case CashType.TWO_EURO:
                return {'fr': '2 euro'};
            case CashType.FIVE_EURO:
                return {'fr': '5 euro'};
            case CashType.TEN_EURO:
                return {'fr': '10 euro'};
            case CashType.TWENTY_EURO:
                return {'fr': '20 euro'};
            case CashType.FIFTY_EURO:
                return {'fr': '50 euro'};
            case CashType.ONE_HUNDRED_EURO:
                return {'fr': '100 euro'};
            case CashType.TWO_HUNDRED_EURO:
                return {'fr': '200 euro'};
            case CashType.FIVE_HUNDRED_EURO:
                return {'fr': '500 euro'};
        }
        return {};
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
    CashType.ONE_CENT,
    CashType.TWO_CENT,
    CashType.FIVE_CENT,
    CashType.TEN_CENT,
    CashType.TWENTY_CENT,
    CashType.FIFTY_CENT,
    CashType.ONE_EURO,
    CashType.TWO_EURO,
    CashType.FIVE_EURO,
    CashType.TEN_EURO,
    CashType.TWENTY_EURO,
    CashType.FIFTY_EURO,
    CashType.ONE_HUNDRED_EURO,
    CashType.TWO_HUNDRED_EURO,
    CashType.FIVE_HUNDRED_EURO
];