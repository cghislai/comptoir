/**
 * Created by cghislai on 08/09/15.
 */

import {Balance} from '../domain/balance';
import {Account, AccountRef, AccountClient, AccountFactory} from '../domain/account';

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
export function NewBalance(desc: any) : LocalBalance {
    return <any>BalanceRecord(desc);
}

export class LocalBalanceFactory {
    static accountClient = new AccountClient();

    static toLocalBalance(balance:Balance, authToken:string):Promise<LocalBalance> {
        var localBalanceDesc:any = {};
        localBalanceDesc.id = balance.id;
        localBalanceDesc.balance = balance.balance;
        localBalanceDesc.closed = balance.closed;
        localBalanceDesc.comment = balance.comment;
        localBalanceDesc.dateTime = balance.dateTime;

        var taskList = [];
        var accountRef = balance.accountRef;
        taskList.push(
            LocalBalanceFactory.accountClient.getFromCacheOrServer(accountRef.id, authToken)
                .then((account)=> {
                    return LocalAccountFactory.toLocalAccount(account, authToken);
                }).then((localAccount:LocalAccount)=> {
                    localBalanceDesc.account = localAccount;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                return NewBalance(localBalanceDesc);
            });
    }

    static fromLocalBalance(localBalance:LocalBalance):Balance {
        var balance = new Balance();
        balance.accountRef = new AccountRef(localBalance.account.id);
        balance.balance = localBalance.balance;
        balance.closed = localBalance.closed;
        balance.comment = localBalance.comment;
        balance.dateTime = localBalance.dateTime;
        balance.id = localBalance.id;
        return balance;
    }
}