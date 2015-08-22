/**
 * Created by cghislai on 19/08/15.
 */
import {Inject} from 'angular2/angular2';

import {Account, AccountRef} from 'client/domain/account';
import {Balance, BalanceRef, BalanceSearch, BalanceFactory} from "client/domain/balance";
import {MoneyPile, MoneyPileRef, MoneyPileFactory} from 'client/domain/moneyPile';

import {ABalance, AMoneyPile, CashType} from 'client/utils/aBalance';
import {Pagination} from 'client/utils/pagination';

import {BalanceClient} from "client/balance";
import {MoneyPileClient} from 'client/moneyPile';

import {AuthService} from 'services/auth';

export class BalanceService {
    authService:AuthService;
    balanceClient:BalanceClient;
    moneyPileClient:MoneyPileClient;

    constructor(@Inject authService:AuthService) {
        this.authService = authService;
        this.balanceClient = new BalanceClient();
        this.moneyPileClient = new MoneyPileClient();
    }

    searchBalances(balanceSearch:BalanceSearch, pagination:Pagination) {
        var authToken = this.authService.authToken;
        balanceSearch.companyRef = this.authService.loggedEmployee.companyRef;
        return this.balanceClient.searchBalances(balanceSearch, pagination, authToken);
    }

    openABalance(aBalance:ABalance):Promise<ABalance> {
        var authToken = this.authService.authToken;
        var account = aBalance.account;
        var balance = new Balance();
        balance.accountRef = new AccountRef(account.id);
        balance.balance = 0;
        aBalance.balance = balance;

        aBalance.dirty = true;
        this.calcABalance(aBalance);

        return this.balanceClient.createBalance(balance, authToken)
            .then((balanceRef)=> {
                return this.balanceClient.getBalance(balanceRef.id, authToken);
            }).then((balance:Balance)=> {
                aBalance.balance = balance;
                aBalance.dirty = false;
                this.calcABalance(aBalance);
                return aBalance;
            });
    }

    updateABalance(aBalance:ABalance):Promise<ABalance> {
        var authToken = this.authService.authToken;
        aBalance.dirty = true;
        this.calcABalance(aBalance);

        this.balanceClient.updateBalance(aBalance.balance, authToken)
            .then((balanceRef)=> {
                return this.balanceClient.getBalance(balanceRef.id, authToken);
            }).then((balance:Balance)=> {
                aBalance.balance = balance;
                aBalance.dirty = false;
                this.calcABalance(aBalance);
            });
        return Promise.resolve(aBalance);
    }

    updateAMoneyPile(aMoneyPile:AMoneyPile):Promise<ABalance> {
        var authToken = this.authService.authToken;
        var aBalance = aMoneyPile.aBalance;

        if (aBalance.balance == null) {
            return this.openABalance(aBalance)
                .then(()=> {
                    return this.updateAMoneyPile(aMoneyPile);
                });

        }
        var moneyPile = aMoneyPile.moneyPile;
        moneyPile.accountRef = aBalance.balance.accountRef;
        moneyPile.balanceRef = new BalanceRef(aBalance.balance.id);

        aMoneyPile.dirty = true;
        this.calcABalance(aBalance);

        if (moneyPile.id == null) {
            this.moneyPileClient.createMoneyPile(moneyPile, authToken)
                .then((pileRef)=> {
                    return this.moneyPileClient.getMoneyPile(pileRef.id, authToken);
                }).then((pile:MoneyPile)=> {
                    aMoneyPile.moneyPile = pile;
                    this.calcABalance(aBalance);
                });
        } else {
            this.moneyPileClient.updateMoneyPile(moneyPile, authToken)
                .then((pileRef)=> {
                    return this.moneyPileClient.getMoneyPile(pileRef.id, authToken);
                }).then((pile:MoneyPile)=> {
                    aMoneyPile.moneyPile = pile;
                    this.calcABalance(aBalance);
                });
        }
        return Promise.resolve(aBalance);
    }


    closeABalance(aBalance:ABalance) {
        var authToken = this.authService.authToken;
        var id = aBalance.balance.id;
        aBalance.dirty = true;

        return this.balanceClient.closeBalance(id, authToken)
            .then((balanceRef)=> {
                return this.balanceClient.getBalance(balanceRef.id, authToken)
            }).then((balance:Balance)=> {
                aBalance.balance = balance;
                aBalance.dirty = false;
                this.calcABalance(aBalance);
            });
    }

    calcABalance(aBalance:ABalance) {
        var total = 0;

        for (var aMoneyPile of aBalance.moneyPiles) {
            var pileTotal = 0;
            if (!aMoneyPile.dirty && aMoneyPile.moneyPile != null
                && aMoneyPile.moneyPile.id != null) {
                pileTotal = aMoneyPile.moneyPile.total;
                aMoneyPile.total = pileTotal;
                total += pileTotal;
                continue;
            }

            var amount = aMoneyPile.moneyPile.count;
            if (isNaN(amount)) {
                amount = 0;
            }
            var value = aMoneyPile.moneyPile.unitAmount;
            pileTotal = amount * value;
            aMoneyPile.total = pileTotal;
            total += pileTotal;
        }

        if (!aBalance.dirty && aBalance.balance != null
            && aBalance.balance.id != null) {
            total = aBalance.balance.balance;
        }
        aBalance.total = total;
    }

}