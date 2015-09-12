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

import {AccountService} from 'services/account';
import {AccountingEntryService} from 'services/accountingEntry';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';
import {SaleService} from 'services/sale';

import {FastInput} from 'components/utils/fastInput'


@Component({
    selector: "payView",
    events: ['paid'],
    properties: ['sale', 'pos', 'noInput']
})
@View({
    templateUrl: './components/sales/sale/payView/payView.html',
    styleUrls: ['./components/sales/sale/payView/payView.css'],
    directives: [NgFor, NgIf, FastInput]
})

export class PayView implements  OnChanges{
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
        var accountSearch = new AccountSearch();
        accountSearch.companyRef = authService.getEmployeeCompanyRef();
        accountSearch.type = AccountType[AccountType.PAYMENT];
        this.accountsSearchRequest.search = accountSearch;

        this.accountingEntriesSearchRequest = new SearchRequest<LocalAccountingEntry>();
        var accountingEntriesSearch = new AccountingEntrySearch();
        accountingEntriesSearch.companyRef = authService.getEmployeeCompanyRef();
        this.accountingEntriesSearchRequest.search = accountingEntriesSearch;

        this.accountingEntriesSearchResult = new SearchResult<LocalAccountingEntry>();
        this.accountingEntriesSearchResult.list = [];
        this.totalPaidAmount = 0;

        this.locale = authService.getEmployeeLanguage().locale;
        this.toPayAmount = 0;
    }


    onChanges(changes:StringMap<string, any>):void {
        var saleChanges = changes.get('sale');
        var posChanges = changes.get('pos');
        if (saleChanges != null) {
            var newSale: LocalSale = saleChanges.currentValue;
            if (newSale != null && newSale.id != null) {
                this.searchTotalPaid();
                this.searchAccountingEntries();
            }
        }

        if (saleChanges != null || posChanges != null) {
            if (this.sale != null && this.pos != null) {
                if (!this.sale.closed) {
                    this.searchAccounts();
                }
            }
        }
    }

    private hasSale():boolean {
        return this.sale != null && this.sale.id != null;
    }

    searchAccounts() {
        if (this.pos != null) {
            var posRef = new PosRef(this.pos.id);
            this.accountsSearchRequest.search.posRef = posRef;
        }

        this.accountService.search(this.accountsSearchRequest)
            .then((result:SearchResult<LocalAccount>)=> {
                this.accountsSearchResult = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    searchAccountingEntries() {
        var accountingEntriesSearch = this.accountingEntriesSearchRequest.search;
        accountingEntriesSearch.accountingTransactionRef = this.sale.accountingTransactionRef;

        this.accountingEntryService.search(this.accountingEntriesSearchRequest, this.accountingEntriesSearchResult)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    searchTotalPaid() {
        if (this.totalPaidRequest != null) {
            this.totalPaidRequest.discardRequest();
        }
        var client:SaleClient = new SaleClient();
        var saleId = this.sale.id;
        var authToken = this.saleService.authService.authToken;
        this.totalPaidRequest = client.getGetTotalPayedRequest(saleId, authToken);
        this.totalPaidRequest.run()
            .then((response:ComptoirResponse)=> {
                var valueJSON = JSON.parse(response.text);
                var totalPaidAmount = NumberUtils.toFixedDecimals(valueJSON.value, 2);
                if (totalPaidAmount == null) {
                    totalPaidAmount = 0;
                }
                this.totalPaidRequest = null;

                var totalToPay = this.sale.vatExclusiveAmount;
                totalToPay += this.sale.vatAmount;

                this.totalPaidAmount = totalPaidAmount;
                this.toPayAmount = NumberUtils.toFixedDecimals(totalToPay - totalPaidAmount, 2);
            });
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
            return;
            this.cancelEditEntry();
        }
        amount = NumberUtils.toFixedDecimals(amount, 2);
        this.editingEntry.amount = amount;

        this.accountingEntryService.save(this.editingEntry)
            .then(()=> {
                this.searchTotalPaid();
                this.searchAccountingEntries();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.cancelEditEntry();
    }

    cancelEditEntry() {
        this.editingEntry = null;
    }

    removeEntry(entry:LocalAccountingEntry) {
        return this.accountingEntryService.remove(entry)
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