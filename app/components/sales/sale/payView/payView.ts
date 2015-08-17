/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, EventEmitter, NgFor, NgIf} from 'angular2/angular2';

import {Sale} from 'client/domain/sale';
import {Account, AccountRef,AccountSearch} from 'client/domain/account';
import {Balance, BalanceRef, BalanceSearch} from 'client/domain/balance'
import {ASale} from 'client/utils/aSale';
import {SearchResult} from 'client/utils/search';

import {ApplicationService} from 'services/application';
import {AccountService} from 'services/account';
import {PaymentService} from 'services/payment';

import {AutoFocusDirective} from 'directives/autoFocus'

class Pay {
    account:Account;
    balance:Balance;

    amount:number;
}

@Component({
    selector: "payView",
    events: ['paid'],
    properties: ['aSale: sale']
})
@View({
    templateUrl: './components/sales/sale/payView/payView.html',
    styleUrls: ['./components/sales/sale/payView/payView.css'],
    directives: [NgFor, NgIf, AutoFocusDirective]
})

export class PayView {
    accountService:AccountService;
    paymentService:PaymentService;
    language:string;

    aSale:ASale;
    remainingAmount:number;
    paidAmount:number;
    paid = new EventEmitter();

    payList:Pay[];
    allAccounts:Account[];
    editingPay:Pay;


    constructor(accountService:AccountService, applicationService:ApplicationService,
    paymentService: PaymentService) {
        this.accountService = accountService;
        this.paymentService = paymentService;
        this.language = applicationService.language.locale;
        this.payList = [];
        this.editingPay = null;
        this.remainingAmount = 0;
        this.searchAccounts();
    }

    searchAccounts() {
        var accountSearch = new AccountSearch();
        // TODO: posRef
        var thisView = this;
        this.accountService.searchAccounts(accountSearch, null)
            .then((result:SearchResult<Account>)=> {
                thisView.allAccounts = result.list;
            });
    }

    startEditPay(account:Account) {
        if (this.editingPay != null) {
            this.cancelEditPay();
        }
        this.editingPay = new Pay();
        this.editingPay.account = account;
    }

    cancelEditPay() {
        this.editingPay = null;
    }

    savePay() {
        var pay = this.editingPay;
        this.editingPay = null;
        var amount = pay.amount;
        if (amount <= 0) {
            return;
        }
        var account = pay.account;
        var accountRef = new AccountRef(account.id);
        this.payList.push(pay);

        this.paymentService.openPayment(accountRef)
            .then((balance)=> {
                pay.balance = balance;
                return this.paymentService.addToPayment(balance, amount);
            }).then((balance:Balance)=> {
                pay.balance = balance;
                pay.amount = balance.balance;
                return this.paymentService.closePayment(balance);
            }).then((balance:Balance)=> {
                pay.balance = balance;
                pay.amount = balance.balance;
                this.calcRemaining();
            });
    }

    removePay(pay:Pay) {
        return this.paymentService.removePayment(pay.balance)
            .then(()=> {
                var newPayList:Pay[] = [];
                for (var existingPay of this.payList) {
                    if (existingPay == pay) {
                        return;
                    }
                    newPayList.push(existingPay);
                }
                this.payList = newPayList;
                this.calcRemaining();
            });
    }

    calcRemaining() {
        var sale = this.aSale.sale;
        if (sale == null) {
            this.remainingAmount = 0;
            this.paidAmount = 0;
            return;
        }
        var vatExclusive = sale.vatExclusiveAmount;
        var vatAmount = sale.vatAmount;

        var toPay = vatExclusive + vatAmount;
        if (isNaN(toPay)) {
            this.remainingAmount = undefined;
            return;
        }
        var paidAmount:number = this.calcPaid();
        this.remainingAmount = Number((toPay - paidAmount).toFixed(2));
        this.paidAmount = paidAmount;
    }

    calcPaid():number {
        var paidAmount:number = 0;
        this.payList.forEach(function (pay:Pay) {
            paidAmount = paidAmount + pay.amount;
        })
        paidAmount = Number((paidAmount).toFixed(2));
        return paidAmount;
    }

    onPayAmountKeyUp(amount:string, event) {
        var amountNumber:number = parseFloat(amount);
        switch (event.which) {
            case 13:
            {
                this.editingPay.amount = amountNumber;
                this.savePay();
                return;
            }
            case 27:
            {
                this.cancelEditPay();
                return;
            }
        }
    }

    onValidateClicked() {
        this.paid.next(true);
        this.payList = [];
        this.editingPay = null;
    }
}