/**
 * Created by cghislai on 16/08/15.
 */

import {Inject} from 'angular2/angular2';

import {ASale, ASalePay, ASalePayItem} from 'client/utils/aSale';
import {Account, AccountRef, AccountSearch} from 'client/domain/account';
import {AccountingEntry, AccountingEntryRef, AccountingEntrySearch} from 'client/domain/accountingEntry';
import {Pos, PosRef} from 'client/domain/pos';
import {SearchResult} from 'client/utils/search';
import {AccountingEntryClient} from 'client/accountingEntry';


import {AuthService} from 'services/auth';

export class PaymentService {

    authService:AuthService;
    accountingEntryclient:AccountingEntryClient;

    constructor(@Inject authService:AuthService) {
        this.authService = authService;
        this.accountingEntryclient = new AccountingEntryClient();
    }


    createPayment(aSalePay:ASalePay, account:Account, amount:number):Promise<ASalePayItem> {
        var sale = aSalePay.aSale.sale;
        var transactionRef = sale.accountingTransactionRef;
        var companyRef = this.authService.loggedEmployee.companyRef;
        var authToken = this.authService.authToken;

        var accountingEntry = new AccountingEntry();
        accountingEntry.accountingTransactionRef = transactionRef;
        accountingEntry.accountRef = new AccountRef(account.id);
        accountingEntry.companyRef = companyRef;
        accountingEntry.dateTime = new Date();
        accountingEntry.amount = amount;

        var aSalePayItem = new ASalePayItem();
        aSalePayItem.account = account;
        aSalePayItem.accountingEntry = accountingEntry;
        aSalePayItem.amount = amount;
        aSalePayItem.aSalePay = aSalePay;
        aSalePayItem.dirty = true;

        this.calcASalePay(aSalePay);

        // Fetch in background
        this.accountingEntryclient.createAccountingEntry(accountingEntry, authToken)
            .then((entryRef)=> {
                return this.accountingEntryclient.getAccountingEntry(entryRef.id, authToken);
            }).then((entry: AccountingEntry)=> {
                aSalePayItem.accountingEntry = entry;
                aSalePayItem.dirty = false;
                this.calcASalePay(aSalePay);
                return aSalePay;
            });

        return Promise.resolve(aSalePayItem);
    }

    addPayment(payItem: ASalePayItem) {
        if (payItem.addedToPay) {
            return;
        }
        payItem.aSalePay.payItems.push(payItem);
        payItem.addedToPay = true;
        this.calcASalePay(payItem.aSalePay);
    }

    updatePayment(aSalePayItem:ASalePayItem) : Promise<ASalePayItem> {
        var amount = aSalePayItem.amount;
        var entry = aSalePayItem.accountingEntry;
        var authToken = this.authService.authToken;

        aSalePayItem.dirty = true;
        this.calcASalePay(aSalePayItem.aSalePay);

        entry.amount = amount;
        this.accountingEntryclient.updateAccountingEntry(entry, authToken)
            .then((entryRef)=> {
                return this.accountingEntryclient.getAccountingEntry(entryRef.id, authToken);
            }).then((updatedEntry:AccountingEntry)=> {
                aSalePayItem.accountingEntry = updatedEntry;
                aSalePayItem.dirty = false;
                this.calcASalePay(aSalePayItem.aSalePay);
            });
        return Promise.resolve(aSalePayItem);
    }

    removePayment(aSalePayItem:ASalePayItem):Promise<ASalePay> {
        var aSalePay = aSalePayItem.aSalePay;
        var sale = aSalePay.aSale.sale;
        var entry = aSalePayItem.accountingEntry;
        var authToken = this.authService.authToken;

        aSalePay.dirty = true;
        aSalePayItem.dirty = true;

        var newItems = [];
        for (var oldItem of aSalePay.payItems) {
            if (oldItem == aSalePayItem) {
                continue;
            }
            newItems.push(oldItem);
        }
        aSalePay.payItems = newItems;
        this.calcASalePay(aSalePay);

        this.accountingEntryclient.deleteAccountingEntry(entry.id, authToken)
            .then(()=> {
                var transactionRef = sale.accountingTransactionRef;
                var entrySearch = new AccountingEntrySearch();
                entrySearch.accountingTransactionRef = transactionRef;

                var pos = aSalePay.pos;
                if (pos != null) {
                    var posRef = new PosRef(pos.id);
                    var accountSearch = new AccountSearch();
                    accountSearch.posRef = posRef;
                    entrySearch.accountSearch = accountSearch;
                }

                return this.accountingEntryclient.searchAccountingEntrys(entrySearch, null, authToken)
            }).then((result: SearchResult<AccountingEntry>)=>{
                var entries = result.list;
                this.updateASalePayItems(aSalePay, entries);
            });
        return Promise.resolve(aSalePay);
    }

    calcASalePay(aSalePay:ASalePay) {
        var totalPaid:number = 0;
        for (var payItem of aSalePay.payItems) {
            if (!payItem.dirty && payItem.accountingEntry != null) {
                var amount = payItem.accountingEntry.amount;
                totalPaid += amount;
                continue;
            }
            totalPaid += payItem.amount;
        }
        var toPay = aSalePay.aSale.vatExclusive;

        var totalPaidRounded = totalPaid.toFixed(2);
        totalPaid = parseFloat(totalPaidRounded);
        aSalePay.amount = totalPaid;
        var missingAmount = toPay - totalPaid;
        var missingRounded = missingAmount.toFixed(2);
        missingAmount = parseFloat(missingRounded);
        aSalePay.missingAmount = missingAmount;
    }

    updateASalePayItems(aSalePay: ASalePay, items: AccountingEntry[])  {
        var oldItems = aSalePay.payItems;
        var perIdMap : {[entryId: number]: ASalePayItem;} = {};
        for (var payItem of oldItems) {
            perIdMap[payItem.accountingEntry.id] = payItem;
        }
        var newItems = [];
        for (var accountingEntry of items) {
            var payItem: ASalePayItem = perIdMap[accountingEntry.id];
            if (payItem == null) {
                payItem = new ASalePayItem();
                payItem.aSalePay = aSalePay;
            }
            payItem.amount = accountingEntry.amount;
            payItem.accountingEntry = accountingEntry;
            payItem.dirty = false;
            newItems.push(payItem);
            delete perIdMap[accountingEntry.id];
        }
        for (var missingId in perIdMap) {
            console.log("Warning: missing accounting entry id "+missingId+" from the new lsit fetched");
        }
        aSalePay.payItems = newItems;
        aSalePay.dirty = false;
        this.calcASalePay(aSalePay);
    }

}