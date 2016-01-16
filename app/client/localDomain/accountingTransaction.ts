/**
 * Created by cghislai on 02/09/15.
 */

import {AccountingTransaction, AccountingTransactionRef,AccountingTransactionType } from '../domain/accountingTransaction';
import {AccountRef} from '../domain/account';
import {CompanyRef} from '../domain/company';
import {CustomerRef, Customer} from '../domain/customer';

import {LocalAccount} from './account';
import {LocalCompany} from './company';

import {LocaleTexts} from '../utils/lang';

import * as Immutable from 'immutable';

export interface LocalAccountingTransaction extends Immutable.Map<string, any> {
    id:number;
    company:LocalCompany;
    dateTime:Date;
    accountingTransactionType:AccountingTransactionType;
}
var AccountingtTansactionRecord = Immutable.Record({
    id: null,
    company: null,
    dateTime: null,
    accountingTransactionType: null
});

export class LocalAccountingTransactionFactory {

    static createAccountingTransaction(desc:any) {
        return <any>AccountingtTansactionRecord(desc);
    }
}