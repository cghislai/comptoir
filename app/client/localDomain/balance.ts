/**
 * Created by cghislai on 08/09/15.
 */

import {Balance} from 'client/domain/balance';
import {Account, AccountRef, AccountClient, AccountFactory} from 'client/domain/account';
import {LocalAccount, LocalAccountFactory} from 'client/localDomain/account';

export class LocalBalance {
    id:number;
    account:LocalAccount;
    dateTime:Date;
    balance:number;
    comment:string;
    closed:boolean;
}

export class LocalBalanceFactory {
    static toLocalBalance(balance:Balance, authToken:string):Promise<LocalBalance> {
        var localBalance = new LocalBalance();
        return LocalBalanceFactory.updateLocalBalance(localBalance, balance, authToken);
    }

    static updateLocalBalance(localBalance:LocalBalance, balance:Balance, authToken:string):Promise<LocalBalance> {
        localBalance.balance = balance.balance;
        localBalance.closed = balance.closed;
        localBalance.comment = balance.comment;
        localBalance.dateTime = balance.dateTime;

        var taskList = [];
        var accountRef = balance.accountRef;
        var accountClient = new AccountClient();
        taskList.push(
            accountClient.getFromCacheOrServer(accountRef.id, authToken)
                .then((account)=> {
                    return LocalAccountFactory.toLocalAccount(account, authToken);
                }).then((localAccount: LocalAccount)=> {
                    localBalance.account = localAccount;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                return localBalance;
            });
    }

    static fromLocalBalance(localBalance: LocalBalance) : Balance {
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