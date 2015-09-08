/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, EventEmitter, NgFor, NgIf} from 'angular2/angular2';

import {LocalSale} from 'client/localDomain/sale';
import {LocalAccount} from 'client/localDomain/account';
import {LocalAccountingEntry} from 'client/localDomain/accountingEntry';


import {AccountingEntry, AccountingEntrySearch} from 'client/domain/accountingEntry';
import {Account, AccountRef,AccountSearch} from 'client/domain/account';
import {Pos, PosRef} from 'client/domain/pos';
import {CompanyRef} from 'client/domain/company';
import {AccountingTransactionRef} from 'client/domain/accountingTransaction';
import {SearchRequest, SearchResult} from 'client/utils/search';
import {NumberUtils} from 'client/utils/number';
import {ComptoirRequest, ComptoirResponse} from 'client/utils/request';

import {AccountService} from 'services/account';
import {AccountingEntryService} from 'services/accountingEntry';
import {ErrorService} from 'services/error';
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
    accountingEntryService:AccountingEntryService;
    saleService:SaleService;
    errorService:ErrorService;

    accountsSearchRequest:SearchRequest<LocalAccount>;
    accountsSearchResult:SearchResult<LocalAccount>;
    accountingEntriesSearchRequest:SearchRequest<LocalAccountingEntry>;
    accountingEntriesSearchResult:SearchResult<LocalAccountingEntry>;
    totalPaidAmount:number;
    totalPaidRequest:ComptoirRequest;

    sale:LocalSale;
    pos:Pos;

    editingEntry:LocalAccountingEntry;
    locale:string;
    noInput:boolean;
    toPayAmount:number;

    paid = new EventEmitter();

    constructor(accountService:AccountService, accountingEntryService:AccountingEntryService,
                errorService:ErrorService, saleService:SaleService, authService:AuthService) {
        this.accountService = accountService;
        this.accountingEntryService = accountingEntryService;
        this.saleService = saleService;
        this.errorService = errorService;

        this.accountsSearchRequest = new SearchRequest<LocalAccount>();
        this.accountingEntriesSearchRequest = new SearchRequest<LocalAccountingEntry>();
        this.totalPaidAmount = 0;

        this.locale = authService.getEmployeeLanguage().locale;
        this.toPayAmount = 0;
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
        this.searchAccounts();
        this.searchAccountingEntries();
        this.searchTotalPaid();
    }

    searchAccounts() {
        if (this.sale.closed) {
            return;
        }
        var posRef = new PosRef(this.pos.id);
        var accountSearch = new AccountSearch();
        accountSearch.posRef = posRef;
        this.accountsSearchRequest.search = accountSearch;

        this.accountService.searchAccounts(this.accountsSearchRequest)
            .then((result:SearchResult<LocalAccount>)=> {
                this.accountsSearchResult = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    searchAccountingEntries() {
        var posRef = new PosRef(this.pos.id);
        var accountSearch = new AccountSearch();
        accountSearch.posRef = posRef;
        var accountingEntriesSearch = new AccountingEntrySearch();
        accountingEntriesSearch.companyRef = new CompanyRef(this.sale.company.id);
        accountingEntriesSearch.accountSearch = accountSearch;
        accountingEntriesSearch.accountingTransactionRef = new AccountingTransactionRef(this.sale.id);
        this.accountingEntriesSearchRequest.search = accountingEntriesSearch;

        this.accountingEntryService.searchAccountingEntrys(this.accountingEntriesSearchRequest)
            .then((result:SearchResult<LocalAccountingEntry>)=> {
                this.accountingEntriesSearchResult = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    searchTotalPaid() {
        if (this.totalPaidRequest != null) {
            this.totalPaidRequest.discardRequest();
        }
        var client = this.saleService.client;
        var saleId = this.sale.id;
        var authToken = this.saleService.authService.authToken;
        this.totalPaidRequest = client.getGetTotalPayedRequest(saleId, authToken);
        this.totalPaidRequest.run()
            .then((response:ComptoirResponse)=> {
                var valueJSON = JSON.parse(response.text);
                this.totalPaidAmount = valueJSON.value;
                this.totalPaidRequest = null;

                var totalToPay = this.sale.vatExclusiveAmount;
                totalToPay += this.sale.vatAmount;

                this.toPayAmount = totalToPay - this.totalPaidAmount;
            });
    }

    addAccountingEntry(account:LocalAccount) {
        var localAccountingEntry = new LocalAccountingEntry();
        localAccountingEntry.account = account;
        localAccountingEntry.amount = this.toPayAmount;

        this.startEditEntry(localAccountingEntry);
        this.accountingEntryService.createAccountingEntry(localAccountingEntry)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
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
            return;
            this.cancelEditEntry();
        }
        amount = NumberUtils.toFixedDecimals(amount, 2);
        this.editingEntry.amount = amount;
        var nextTask = Promise.resolve(true);

        var entryExists = this.editingEntry.id != null;
        if (entryExists) {
            nextTask.then(()=> {
                return this.accountingEntryService.createAccountingEntry(this.editingEntry);
            });
        } else {
            nextTask.then(()=> {
                return this.accountingEntryService.updateAccountingEntry(this.editingEntry);
            });
        }
        nextTask.then(()=> {
            this.searchTotalPaid();
        }).catch((error)=> {
            this.errorService.handleRequestError(error);
        });
        this.cancelEditEntry();
    }

    cancelEditEntry() {
        this.editingEntry = null;
    }

    removeEntry(entry:LocalAccountingEntry) {
        return this.accountingEntryService.removeAccountingEntry(entry.id   )
            .then(()=> {
                this.searchAccountingEntries();
                this.searchTotalPaid();
            });
    }

    onValidateClicked() {
        this.paid.next(true);
        this.cancelEditEntry();
    }
}