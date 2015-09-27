/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, EventEmitter, NgFor, NgIf, OnChanges} from 'angular2/angular2';

import {LocalSale} from 'client/localDomain/sale';
import {LocalAccount} from 'client/localDomain/account';
import {LocalAccountingEntry,LocalAccountingEntryFactory } from 'client/localDomain/accountingEntry';

import {AccountingEntry, AccountingEntrySearch} from 'client/domain/accountingEntry';
import {Account, AccountRef, AccountType, AccountSearch} from 'client/domain/account';
import {Pos, PosRef} from 'client/domain/pos';
import {SaleClient} from 'client/domain/sale';
import {CompanyRef} from 'client/domain/company';
import {AccountingTransactionRef} from 'client/domain/accountingTransaction';
import {SearchRequest, SearchResult} from 'client/utils/search';
import {NumberUtils} from 'client/utils/number';
import {LocaleTexts} from 'client/utils/lang';
import {ComptoirRequest, ComptoirResponse} from 'client/utils/request';

import {ActiveSaleService} from 'routes/sales/sale/activeSale';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';

import {FastInput} from 'components/utils/fastInput'


@Component({
    selector: "payView",
    events: ['paid'],
    properties: ['saleTotal', 'noInput']
})
@View({
    templateUrl: './components/sales/sale/payView/payView.html',
    styleUrls: ['./components/sales/sale/payView/payView.css'],
    directives: [NgFor, NgIf, FastInput]
})

export class PayView {
    errorService:ErrorService;
    activeSaleService:ActiveSaleService;

    editingEntry:LocalAccountingEntry;
    locale:string;
    noInput:boolean;
    saleTotal:number;

    paid = new EventEmitter();

    constructor(activeSaleService:ActiveSaleService,
                errorService:ErrorService, authService:AuthService) {
        this.activeSaleService = activeSaleService;
        this.errorService = errorService;

        this.locale = authService.getEmployeeLanguage().locale;
    }

    get sale() {
        return this.activeSaleService.sale;
    }

    hasSale():boolean {
        return this.sale != null && this.sale.id != null;
    }

    isSearching():boolean {
        return this.activeSaleService.accountingEntriesRequest.busy;
    }

    hasAccountingEntries():boolean {
        return this.activeSaleService.accountingEntriesResult.count > 0;
    }

    get accountingEntriesResult() {
        return this.activeSaleService.accountingEntriesResult;
    }

    get accountsResult() {
        return this.activeSaleService.accountsResult;
    }

    get toPayAmount() {
        var total = this.saleTotal - this.activeSaleService.paidAmount;
        return NumberUtils.toFixedDecimals(total, 2);
    }


    addAccountingEntry(account:LocalAccount) {
        var localAccountingEntry = new LocalAccountingEntry();
        localAccountingEntry.account = account;
        localAccountingEntry.amount = this.toPayAmount;
        localAccountingEntry.company = account.company;
        localAccountingEntry.accountingTransactionRef = this.sale.accountingTransactionRef;
        localAccountingEntry.customer = this.sale.customer;
        localAccountingEntry.description = new LocaleTexts();
        localAccountingEntry.dateTime = new Date();

        this.startEditEntry(localAccountingEntry);
    }

    startEditEntry(localAccountingEntry:LocalAccountingEntry) {
        if (this.editingEntry != null) {
            this.cancelEditEntry();
        }
        this.editingEntry = localAccountingEntry;
        if (this.editingEntry.amount == null || this.editingEntry.amount <= 0) {
            this.editingEntry.amount = this.toPayAmount;
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
        if (isNaN(amount)) {
            this.cancelEditEntry();
            return;
        }
        amount = NumberUtils.toFixedDecimals(amount, 2);
        this.editingEntry.amount = amount;

        this.activeSaleService.doAddAccountingEntry(this.editingEntry)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.cancelEditEntry();
    }

    cancelEditEntry() {
        this.editingEntry = null;
    }

    removeEntry(entry:LocalAccountingEntry) {
        return this.activeSaleService.doRemoveAccountingEntry(entry)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    onValidateClicked() {
        this.cancelEditEntry();
        this.activeSaleService.doCloseSale()
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.paid.next(true);
    }
}