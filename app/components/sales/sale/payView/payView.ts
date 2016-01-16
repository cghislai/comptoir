/**
 * Created by cghislai on 29/07/15.
 */

import {Component, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';

import {LocalSale} from '../../../../client/localDomain/sale';
import {LocalAccount} from '../../../../client/localDomain/account';
import {LocalAccountingEntry, LocalAccountingEntryFactory} from '../../../../client/localDomain/accountingEntry';

import {NumberUtils} from '../../../../client/utils/number';
import {LocaleTextsFactory, Language} from '../../../../client/utils/lang';

import {ActiveSaleService} from '../../../../services/activeSale';
import {ErrorService} from '../../../../services/error';
import {AuthService} from '../../../../services/auth';

import {FastInput} from '../../../utils/fastInput';
import * as Immutable from 'immutable';

@Component({
    selector: 'pay-view',
    outputs: ['paid'],
    inputs: ['saleTotal', 'paidAmount', 'noInput', 'sale', 'accountingEntries'],
    changeDetection: ChangeDetectionStrategy.Default,
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
    paidAmount:number;
    sale:LocalSale;
    accountingEntries:Immutable.List<LocalAccountingEntry>;
    accountList:Immutable.List<LocalAccount>;
    paid = new EventEmitter();

    constructor(activeSaleService:ActiveSaleService,
                errorService:ErrorService, authService:AuthService) {
        this.activeSaleService = activeSaleService;
        this.errorService = errorService;

        this.language = authService.getEmployeeLanguage();
        this.fetchAccountList();
    }

    hasSale():boolean {
        return this.sale != null && this.sale.id != null;
    }

    isSearching():boolean {
        return this.activeSaleService.accountingEntriesRequest.busy;
    }

    isEditing(entry:LocalAccountingEntry) {
        return this.editingEntry != null && this.editingEntry.id === entry.id;
    }

    fetchAccountList() {
        this.accountList = this.activeSaleService.accountsResult.list;
    }


    get toPayAmount() {
        var total = this.saleTotal - this.activeSaleService.paidAmount;
        return NumberUtils.toFixedDecimals(total, 2);
    }


    addAccountingEntry(account:LocalAccount) {
        var localAccountingEntryDesc:any = {};
        localAccountingEntryDesc.account = account;
        localAccountingEntryDesc.amount = this.toPayAmount;
        localAccountingEntryDesc.company = account.company;
        localAccountingEntryDesc.accountingTransactionRef = this.sale.accountingTransactionRef;
        localAccountingEntryDesc.customer = this.sale.customer;
        localAccountingEntryDesc.description = LocaleTextsFactory.toLocaleTexts({});
        localAccountingEntryDesc.dateTime = new Date();
        var localAccountingEntry = LocalAccountingEntryFactory.createAccountingEntry(localAccountingEntryDesc);
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
