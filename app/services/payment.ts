/**
 * Created by cghislai on 16/08/15.
 */

import {BalanceClient} from 'client/balance';
import {MoneyPileClient} from 'client/moneyPile';

import {Account, AccountRef} from 'client/domain/account';
import {Balance, BalanceRef, BalanceSearch} from 'client/domain/balance';
import {MoneyPile, MoneyPileRef, MoneyPileSearch} from 'client/domain/moneyPile';

import {AuthService} from 'services/auth';

export class PaymentService {

    authService:AuthService;
    balanceClient:BalanceClient;
    moneyPileClient:MoneyPileClient;

    constructor(authService:AuthService) {
        this.authService = authService;
        this.balanceClient = new BalanceClient();
        this.moneyPileClient = new MoneyPileClient();
    }


    openPayment(accountRef:AccountRef):Promise<Balance> {
        var authToken = this.authService.authToken;
        var balance = new Balance();
        balance.accountRef = accountRef;
        return this.balanceClient.createBalance(balance, authToken)
            .then((balanceRef)=> {
                return this.balanceClient.getBalance(balanceRef.id, authToken);
            });
    }

    addToPayment(balance:Balance, amount:number):Promise<Balance> {
        var authToken = this.authService.authToken;
        var moneyPile = new MoneyPile();
        moneyPile.accountRef = balance.accountRef;
        moneyPile.balanceRef = new BalanceRef(balance.id);
        moneyPile.unitAmount = 1;
        moneyPile.count = amount;

        return this.moneyPileClient.createMoneyPile(moneyPile, authToken)
            .then((pileRef)=> {
                return this.balanceClient.getBalance(balance.id, authToken);
            });
    }

        closePayment(balance: Balance):Promise<any> {
        var authToken = this.authService.authToken;

        return this.balanceClient.closeBalance(balance.id, authToken);
    }
}