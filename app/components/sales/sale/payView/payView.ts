/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, EventEmitter, NgFor, NgIf} from 'angular2/angular2';

import {Account, AccountRef,AccountSearch} from 'client/domain/account';
import {SearchResult} from 'client/utils/search';
import {AccountService} from 'services/account';
import {ApplicationService} from 'services/application';

import {Command} from 'services/saleService'
import {AutoFocusDirective} from 'directives/autoFocus'

class Pay {
    account: Account;
    amount: number;
}

@Component({
    selector: "payView",
    events: ['paid'],
    properties: ['command']
})
@View({
    templateUrl: './components/sales/sale/payView/payView.html',
    styleUrls: ['./components/sales/sale/payView/payView.css'],
    directives: [NgFor, NgIf, AutoFocusDirective]
})

export class PayView {
    accountService: AccountService;
    language: string;

    command: Command;
    remainingAmount: number;
    paidAmount: number;
    paid= new EventEmitter();
    //cancelled= new EventEmitter();

    payList: Pay[];
    allAccounts: Account[];
    editingPay: Pay;


    constructor(accountService: AccountService, applicationService: ApplicationService) {
        this.accountService = accountService;
        this.language = applicationService.language.locale;
        this.reset();
    }

    reset() {
        this.payList = [];
        this.editingPay = null;
        this.remainingAmount = undefined;
        this.paidAmount = 0;
        this.searchAccounts();
    }

    searchAccounts() {
        var accountSearch = new AccountSearch();
        // TODO: posRef
        var thisView = this;
        this.accountService.searchAccounts(accountSearch, null)
        .then((result: SearchResult<Account>)=>{
                thisView.allAccounts = result.list;
            });
    }

    startEditPay(account: Account) {
        if (this.editingPay != null) {
            this.cancelEditPay();
        }
        this.editingPay = new Pay();
        this.editingPay.account = account;
        this.editingPay.amount = this.remainingAmount;

    }
    cancelEditPay() {
        this.editingPay = null;
    }
    savePay() {
        if (this.editingPay.amount > 0) {
            this.payList.push(this.editingPay);
        }
        this.editingPay = null;
        this.calcRemaining();
    }
    removePay(pay: Pay) {
        var newPayList : Pay[] = [];
        for (var existingPay of this.payList) {
            if (existingPay == pay) {
                return;
            }
            newPayList.push(existingPay);
        }
        this.payList = newPayList;
        this.calcRemaining();
    }
    calcRemaining() {
        var toPay = this.command.totalPrice;
        if (isNaN(toPay)) {
            this.remainingAmount = undefined;
            return;
        }
        var paidAmount:number = this.calcPaid();
        this.remainingAmount= Number((toPay- paidAmount).toFixed(2));
        this.paidAmount = paidAmount;
    }
    calcPaid() : number {
        var paidAmount : number =  0;
        this.payList.forEach(function(pay: Pay) {
            paidAmount = paidAmount +  pay.amount;
        })
        paidAmount = Number((paidAmount).toFixed(2));
        return paidAmount;
    }
    onPayAmountKeyUp(amount: string, event) {
        var amountNumber : number = parseFloat(amount);
        switch (event.which) {
            case 13: {
                this.editingPay.amount = amountNumber;
                this.savePay();
                return;
            }
                case 27: {
                    this.cancelEditPay();
                    return;
                }
        }
    }

    onValidateClicked() {
        // TODO: validate the paiment
       this.reset();
        this.paid.next(true);
    }
}