/**
 * Created by cghislai on 02/09/15.
 */

import {AccountingEntry, AccountingEntryRef, AccountingEntryFactory} from '../domain/accountingEntry';
import {AccountingTransactionRef} from '../domain/accountingTransaction';
import {AccountRef} from '../domain/account';
import {CompanyRef} from '../domain/company';
import {CustomerRef, Customer} from '../domain/customer';

import {LocalAccount} from './account';
import {LocalCompany} from './company';

import {LocaleTexts} from '../utils/lang';

import * as Immutable from 'immutable';

export interface LocalAccountingEntry extends Immutable.Map<string, any> {
    id:number;
    company:LocalCompany;
    amount:number;
    vatRate:number;
    dateTime:Date;
    description:LocaleTexts;
    accountingTransactionRef:AccountingTransactionRef;
    vatAccountingEntry:LocalAccountingEntry;
    customer:Customer;

    account:LocalAccount;
}
var AccountingEntryRecord = Immutable.Record({
    id: null,
    company: null,
    amount: null,
    vatRate: null,
    dateTime: null,
    description: null,
    accountingTransactionRef: null,
    vatAccountingEntry: null,
    customer: null,
    account: null
});

export class LocalAccountingEntryFactory {

    static createAccountingEntry(desc:any) {
        return <any>AccountingEntryRecord(desc);
    }

}