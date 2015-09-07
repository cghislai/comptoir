/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, EventEmitter, NgFor, NgIf} from 'angular2/angular2';

import {LocalSale} from 'client/localDomain/sale';
import {LocalAccount} from 'client/localDomain/account';
import {LocalAccountingEntry} from 'client/localDomain/accountingEntry';


import {AccountingEntry} from 'client/domain/accountingEntry';
import {Account, AccountRef,AccountSearch} from 'client/domain/account';
import {Pos, PosRef} from 'client/domain/pos';
import {SearchResult} from 'client/utils/search';
import {NumberUtils} from 'client/utils/number';

import {ErrorService} from 'services/error';
import {AccountService} from 'services/account';
import {AuthService} from 'services/auth';
import {SaleService} from 'services/sale';

import {FastInput} from 'directives/fastInput'


@Component({
    selector: "payView",
    events: ['paid'],
    properties: ['saleProp: sale', 'posProp: pos', 'noInput']
})
@View({
    templateUrl: './components/sales/sale/payView/payView.html',
    styleUrls: ['./components/sales/sale/payView/payView.css'],
    directives: [NgFor, NgIf, FastInput]
})

export class PayView {
    accountService:AccountService;
    saleService:SaleService;
    errorService:ErrorService;
    locale:string;

    sale:LocalSale;
    editingEntry:LocalAccountingEntry;
    pos:Pos;
    noInput:boolean;

    paid = new EventEmitter();
    toPay: number;

    allAccounts:LocalAccount[];


    constructor(accountService:AccountService, errorService:ErrorService,
                saleService:SaleService, authService:AuthService) {
        this.accountService = accountService;
        this.saleService = saleService;
        this.errorService = errorService;
        this.locale = authService.getEmployeeLanguage().locale;
        this.toPay = 0;
    }

    set saleProp(value:LocalSale) {
        this.sale = value;
        this.start();
    }

    set posProp(value:Pos) {
        this.pos = value;
        this.start();
    }

    private hasSale():boolean {
        return this.sale != null && this.sale.id != null;
    }

    start() {
        if (!this.hasSale()) {
            return;
        }
        if (!this.sale.closed) {
            if (this.pos == null) {
                return;
            }
        }
        this.saleService.getLocalSaleAccountingEntriesAsync(this.sale)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.saleService.updateLocalSalePaidAmountAsync(this.sale)
            .then(()=>{
                this.checkToPayAmount();
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.searchAccounts();
    }

    searchAccounts() {
        if (this.sale.closed) {
            return;
        }
        var accountSearch = new AccountSearch();
        var posRef = new PosRef(this.pos.id);
        accountSearch.posRef = posRef;
        var thisView = this;
        this.accountService.searchLocalAccountsAsync(accountSearch, null)
            .then((result:SearchResult<LocalAccount>)=> {
                thisView.allAccounts = result.list;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    addAccountingEntry(account:LocalAccount) {
        var localAccountingEntry = new LocalAccountingEntry();
        var remainingAmount = this.sale.vatExclusiveAmount + this.sale.vatAmount;
        remainingAmount -= this.sale.totalPaid;

        localAccountingEntry.account = account;
        localAccountingEntry.amount = remainingAmount;
        return this.saleService.addAccountingEntryToLocalSaleAsync(this.sale, localAccountingEntry)
            .then(()=> {
                this.startEditEntry(localAccountingEntry);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    startEditNewEntry(account:LocalAccount) {
        var accountingEntry = new LocalAccountingEntry();
        accountingEntry.accountingTransactionRef = this.sale.accountingTransactionRef;
        accountingEntry.account = account;
        this.startEditEntry(accountingEntry);
    }

    startEditEntry(localAccountingEntry:LocalAccountingEntry) {
        if (this.editingEntry != null) {
            this.cancelEditEntry();
        }
        this.editingEntry = localAccountingEntry;
        if (this.editingEntry.amount == null || this.editingEntry.amount <= 0) {
            var toPayAmount = this.sale.vatAmount + this.sale.vatExclusiveAmount - this.sale.totalPaid;
            toPayAmount = NumberUtils.toFixedDecimals(toPayAmount, 2);
            this.editingEntry.amount = toPayAmount;
        }
    }

    validateEntryAmount(value:string) {
        if (value.length > 0) {
            var floatValue = parseFloat(value);
            if (isNaN(floatValue)) {
                return false;
            }
            return floatValue > 0;
        }
        return true;
    }

    applyEditingEntry(event) {
        var amount = parseFloat(event);
        amount = NumberUtils.toFixedDecimals(amount, 2);
        this.editingEntry.amount = amount;

        if (!isNaN(amount)) {
            var entryExists = this.editingEntry.id != null;
            if (entryExists) {
                this.saleService.updateLocalSaleAccountingEntry(this.sale, this.editingEntry)
                    .then(()=>{
                        this.checkToPayAmount();
                    })
                    .catch((error)=> {
                        this.errorService.handleRequestError(error);
                    });
            } else {
                this.saleService.addAccountingEntryToLocalSaleAsync(this.sale, this.editingEntry)
                    .then(()=>{
                        this.checkToPayAmount();
                    })
                    .catch((error)=> {
                        this.errorService.handleRequestError(error);
                    });
            }

        }
        this.cancelEditEntry();
    }

    cancelEditEntry() {
        this.editingEntry = null;
    }

    removeEntry(entry:LocalAccountingEntry) {
        return this.saleService.removeLocalSaleAccountingEntry(this.sale, entry)
            .then(()=>{
                this.checkToPayAmount();
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onValidateClicked() {
        this.paid.next(true);
        this.cancelEditEntry();
    }

    checkToPayAmount(){
        var total = this.sale.vatExclusiveAmount + this.sale.vatAmount;
        total = NumberUtils.toFixedDecimals(total, 2);
        var paid = this.sale.totalPaid;
        this.toPay = total - paid;
        console.log("paid "+paid+" of "+total+"( "+this.sale.vatExclusiveAmount+" + "+this.sale.vatAmount+"), missing "+this.toPay);
    }
}