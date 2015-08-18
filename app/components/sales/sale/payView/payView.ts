/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, EventEmitter, NgFor, NgIf} from 'angular2/angular2';

import {Sale} from 'client/domain/sale';
import {Account, AccountRef,AccountSearch} from 'client/domain/account';
import {Balance, BalanceRef, BalanceSearch} from 'client/domain/balance'
import {Pos, PosRef} from 'client/domain/pos';
import {ASale, ASalePay, ASalePayItem} from 'client/utils/aSale';
import {SearchResult} from 'client/utils/search';

import {ApplicationService} from 'services/application';
import {AccountService} from 'services/account';
import {PaymentService} from 'services/payment';

import {AutoFocusDirective} from 'directives/autoFocus'


@Component({
    selector: "payView",
    events: ['paid'],
    properties: ['saleProp: sale', 'posProp: pos']
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

    aSalePay:ASalePay;
    editingPayItem:ASalePayItem;

    remainingAmount:number;
    paidAmount:number;
    paid = new EventEmitter();

    allAccounts:Account[];


    constructor(accountService:AccountService, applicationService:ApplicationService,
                paymentService:PaymentService) {
        this.accountService = accountService;
        this.paymentService = paymentService;
        this.language = applicationService.language.locale;
        this.remainingAmount = 0;
        this.aSalePay = new ASalePay();
    }

    set saleProp(value:ASale) {
        this.aSalePay.aSale = value;
    }

    set posProp(value:Pos) {
        this.aSalePay.pos = value;
    }

    start() {
        this.paymentService.calcASalePay(this.aSalePay);
        this.searchAccounts();
    }

    searchAccounts() {
        var accountSearch = new AccountSearch();
        var pos = this.aSalePay.pos;
        if (pos != null) {
            var posRef = new PosRef(pos.id);
            accountSearch.posRef = posRef;
        }
        var thisView = this;
        this.accountService.searchAccounts(accountSearch, null)
            .then((result:SearchResult<Account>)=> {
                thisView.allAccounts = result.list;
            });
    }

    startEditPay(account:Account) {
        if (this.editingPayItem != null) {
            this.cancelEditPayItem();
        }
        this.paymentService.createPayment(this.aSalePay, account, 0)
            .then((payItem)=> {
                this.editingPayItem = payItem;
                this.editingPayItem.amount = this.aSalePay.missingAmount;
            });
    }

    startEditPayItem(payItem: ASalePayItem) {
        if (this.editingPayItem != null) {
            this.cancelEditPayItem();
        }
        this.editingPayItem = payItem;
    }

    cancelEditPayItem() {
        var entry = this.editingPayItem.accountingEntry;
        if (entry != null) {
            var oldAmount = entry.amount;
            this.editingPayItem.amount = oldAmount;
        } else {
            this.editingPayItem.amount = null;
        }
        this.editingPayItem = null;
    }

    savePayItem() {
        if (!this.editingPayItem.addedToPay) {
            this.paymentService.addPayment(this.editingPayItem);
        }
        this.paymentService.updatePayment(this.editingPayItem);
        this.editingPayItem = null;
    }

    removePayItem(payItem:ASalePayItem) {
        return this.paymentService.removePayment(payItem);
    }

    onPayItemKeyUp(amount:string, event) {

        switch (event.which) {
            case 13:
            {
                this.onPayItemChange(event);
                this.savePayItem();
                return false;
            }
            case 27:
            {
                this.cancelEditPayItem();
                return false;
            }
        }
        return false;
    }

    onPayItemChange(event) {
        var amountNumber:number = parseFloat(event.target.value);
        if (isNaN(amountNumber)) {
            this.editingPayItem.amount = null;
            return;
        }
        var roundedString = amountNumber.toFixed(2);
        amountNumber = parseFloat(roundedString);
        this.editingPayItem.amount = amountNumber;
    }

    onValidateClicked() {
        this.paid.next(true);
        this.editingPayItem = null;
        this.aSalePay = new ASalePay();
    }
}