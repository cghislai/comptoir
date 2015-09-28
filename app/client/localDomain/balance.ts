/**
 * Created by cghislai on 08/09/15.
 */

import {Balance} from 'client/domain/balance';
import {Account, AccountRef, AccountClient, AccountFactory} from 'client/domain/account';

import {LocalAccount, LocalAccountFactory} from 'client/localDomain/account';

import {Map} from 'immutable';

export interface LocalBalance extends Map<string, any> {
    id:number;
    account:LocalAccount;
    dateTime:Date;
    balance:number;
    comment:string;
    closed:boolean;
}

export class LocalBalanceFactory {
    static accountClient = new AccountClient();

    static toLocalBalance(balance:Balance, authToken:string):Promise<LocalBalance> {
        var localBalanceDesc:any = {};
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
                var localBalance:LocalBalance;
                localBalance = <LocalBalance>Map(localBalanceDesc);
                return localBalance;
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