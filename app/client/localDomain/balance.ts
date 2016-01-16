/**
 * Created by cghislai on 08/09/15.
 */
import {Injector} from 'angular2/core';


import {Balance} from '../domain/balance';
import {Account, AccountRef, AccountFactory} from '../domain/account';

import {LocalAccount, LocalAccountFactory} from './account';

import * as Immutable from 'immutable';

export interface LocalBalance extends Immutable.Map<string, any> {
    id:number;
    account:LocalAccount;
    dateTime:Date;
    balance:number;
    comment:string;
    closed:boolean;
}
var BalanceRecord = Immutable.Record({
    id: null,
    account: null,
    dateTime: null,
    balance: null,
    comment: null,
    closed: null
});

export class LocalBalanceFactory {

    static createNewBalance(desc:any):LocalBalance {
        return <any>BalanceRecord(desc);
    }

}