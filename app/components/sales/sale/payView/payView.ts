/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, EventEmitter, NgFor, NgIf, ChangeDetectionStrategy} from 'angular2/angular2';

import {LocalSale} from '../../../../client/localDomain/sale';
import {LocalAccount} from '../../../../client/localDomain/account';
import {LocalAccountingEntry, LocalAccountingEntryFactory, NewAccountingEntry } from '../../../../client/localDomain/accountingEntry';

import {AccountingEntry, AccountingEntrySearch} from '../../../../client/domain/accountingEntry';
import {Account, AccountRef, AccountType, AccountSearch} from '../../../../client/domain/account';
import {Pos, PosRef} from '../../../../client/domain/pos';
import {SaleClient} from '../../../../client/domain/sale';
import {CompanyRef} from '../../../../client/domain/company';
import {AccountingTransactionRef} from '../../../../client/domain/accountingTransaction';
import {SearchRequest, SearchResult} from '../../../../client/utils/search';
import {NumberUtils} from '../../../../client/utils/number';
import {LocaleTexts, LocaleTextsFactory, Language} from '../../../../client/utils/lang';
import {ComptoirRequest, ComptoirResponse} from '../../../../client/utils/request';

import {ActiveSaleService} from '../../../../routes/sales/sale/activeSale';
import {ErrorService} from '../../../../services/error';
import {AuthService} from '../../../../services/auth';

import {FastInput} from '../../../utils/fastInput'
import {List} from 'immutable';

@Component({
    selector: "payView",
    outputs: ['paid'],
    inputs: ['saleTotal', 'paidAmount', 'noInput', 'sale', 'accountingEntries'],
    changeDetection: ChangeDetectionStrategy.OnPush
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
    language:Language;
    noInput:boolean;
    saleTotal:number;
    paidAmount: number;
    sale: LocalSale;
    accountingEntries: List<LocalAccountingEntry>;

    paid = new EventEmitter();

    constructor(activeSaleService:ActiveSaleService,
                errorService:ErrorService, authService:AuthService) {
        this.activeSaleService = activeSaleService;
        this.errorService = errorService;

        this.language = authService.getEmployeeLanguage();
    }

    hasSale():boolean {
        return this.sale != null && this.sale.id != null;
    }

    isSearching():boolean {
        return this.activeSaleService.accountingEntriesRequest.busy;
    }

    isEditing(entry: LocalAccountingEntry) {
        return this.editingEntry != null && this.editingEntry.id == entry.id;
    }


    get accountsResult() {
        return this.activeSaleService.accountsResult;
    }

    get toPayAmount() {
        var total = this.saleTotal - this.activeSaleService.paidAmount;
        return NumberUtils.toFixedDecimals(total, 2);
    }


    addAccountingEntry(account:LocalAccount) {
        var localAccountingEntryDesc: any = {};
        localAccountingEntryDesc.account = account;
        localAccountingEntryDesc.amount = this.toPayAmount;
        localAccountingEntryDesc.company = account.company;
        localAccountingEntryDesc.accountingTransactionRef = this.sale.accountingTransactionRef;
        localAccountingEntryDesc.customer = this.sale.customer;
        localAccountingEntryDesc.description = LocaleTextsFactory.toLocaleTexts({});
        localAccountingEntryDesc.dateTime = new Date();
        var localAccountingEntry = NewAccountingEntry(localAccountingEntryDesc);
        this.startEditEntry(localAccountingEntry);
    }

    startEditEntry(localAccountingEntry:LocalAccountingEntry) {
        if (this.editingEntry != null) {
            this.cancelEditEntry();
        }
        if (localAccountingEntry.amount == null || localAccountingEntry.amount <= 0) {
            this.editingEntry = <LocalAccountingEntry>localAccountingEntry.set('amount', this.toPayAmount);
        } else {
            this.editingEntry = localAccountingEntry;
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
        var entry = <LocalAccountingEntry>this.editingEntry.set('amount', amount);

        this.activeSaleService.doAddAccountingEntry(entry)
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