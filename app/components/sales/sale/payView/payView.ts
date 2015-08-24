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

import {FastInput} from 'directives/fastInput'


@Component({
    selector: "payView",
    events: ['paid'],
    properties: ['saleProp: sale', 'posProp: pos']
})
@View({
    templateUrl: './components/sales/sale/payView/payView.html',
    styleUrls: ['./components/sales/sale/payView/payView.css'],
    directives: [NgFor, NgIf, FastInput]
})

export class PayView {
    accountService:AccountService;
    paymentService:PaymentService;
    appService:ApplicationService;
    language:string;

    aSalePay:ASalePay;
    editingPayItem:ASalePayItem;
    pos:Pos;
    sale:ASale;

    paid = new EventEmitter();

    allAccounts:Account[];


    constructor(accountService:AccountService, applicationService:ApplicationService,
                paymentService:PaymentService) {
        this.accountService = accountService;
        this.paymentService = paymentService;
        this.appService = applicationService;
        this.language = applicationService.language.locale;
        this.aSalePay = new ASalePay();
    }

    set saleProp(value:ASale) {
        this.sale = value;
    }

    set posProp(value:Pos) {
        this.pos = value;
    }

    start() {
        this.aSalePay = this.paymentService.createASalePay(this.sale, this.pos);

        this.paymentService.findASalePayItemsAsync(this.aSalePay)
            .catch((error)=> {
                this.appService.handleRequestError(error);
            });
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
            }).catch((error)=> {
                this.appService.handleRequestError(error);
            });
    }

    startEditPay(account:Account) {
        if (this.editingPayItem != null) {
            this.cancelEditPayItem();
        }
        var payItem:ASalePayItem = new ASalePayItem();
        payItem.aSalePay = this.aSalePay;
        payItem.account = account;
        payItem.amount = 0;


        this.editingPayItem = payItem;
        this.editingPayItem.amount = this.aSalePay.missingAmount;
    }

    startEditPayItem(payItem:ASalePayItem) {
        if (this.editingPayItem != null) {
            this.cancelEditPayItem();
        }
        this.editingPayItem = payItem;
    }

    validatePayAmount(value:string) {
        if (value.length > 0) {
            var floatValue = parseFloat(value);
            if (isNaN(floatValue)) {
                return false;
            }
            return floatValue > 0;
        }
        return true;
    }

    onEditingPayItemChange(event) {
        var amount = parseFloat(event);

        if (!isNaN(amount)) {
            var newItem = this.editingPayItem.accountingEntryId == null;
            if (newItem) {
                this.editingPayItem.amount = amount;
                this.paymentService.createASalePayItem(this.editingPayItem)
                    .catch((error)=> {
                        this.appService.handleRequestError(error);
                    });
            } else {
                this.paymentService.setASalePayItemAmount(this.editingPayItem, amount)
                    .catch((error)=> {
                        this.appService.handleRequestError(error);
                    });
            }
        }
        this.cancelEditPayItem();
    }

    cancelEditPayItem() {
        this.editingPayItem = null;
    }

    removePayItem(payItem:ASalePayItem) {
        return this.paymentService.removeASalePayItem(payItem)
            .catch((error)=> {
            this.appService.handleRequestError(error);
        });
    }

    onValidateClicked() {
        this.paid.next(true);
        this.editingPayItem = null;
        this.aSalePay = new ASalePay();
    }
}