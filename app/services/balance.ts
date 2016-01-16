/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from 'angular2/core';

import {Balance, BalanceRef, BalanceSearch, BalanceFactory} from '../client/domain/balance';
import {AccountRef} from '../client/domain/account';

import {LocalBalance, LocalBalanceFactory} from '../client/localDomain/balance';
import {LocalAccount} from '../client/localDomain/account';

import {WithId} from '../client/utils/withId';
import {SearchRequest, SearchResult} from '../client/utils/search';
import {WsUtils} from '../client/utils/wsClient';

import {BalanceClient} from '../client/balance';

import {AuthService} from './auth';
import {AccountService} from './account';

@Injectable()
export class BalanceService {

    balanceClient:BalanceClient;
    authService:AuthService;
    accountService:AccountService;

    constructor(balanceClient:BalanceClient,
                authService:AuthService,
                accountService:AccountService) {
        this.balanceClient = balanceClient;
        this.authService = authService;
        this.accountService = accountService;
    }

    get(id:number):Promise<LocalBalance> {
        return this.balanceClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:Balance)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.balanceClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalBalance):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.balanceClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalBalance>):Promise<SearchResult<LocalBalance>> {
        return this.balanceClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<Balance>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalBalance>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    closeBalance(localBalance:LocalBalance):Promise<BalanceRef> {
        var url = this.balanceClient.webServiceUrl + this.balanceClient.resourcePath + '/' + localBalance.id;
        url += "/state/CLOSED";
        var options = WsUtils.getRequestOptions(this.getAuthToken());
        options.url = url;
        options.method = 'PUT';

        var request = this.balanceClient.http.request(url, options);
        return request
            .map((response)=> {
                return <BalanceRef>response.json();
            })
            .toPromise();
    }


    toLocalConverter(balance:Balance):Promise<LocalBalance> {
        var localBalanceDesc:any = {};
        localBalanceDesc.id = balance.id;
        localBalanceDesc.balance = balance.balance;
        localBalanceDesc.closed = balance.closed;
        localBalanceDesc.comment = balance.comment;
        localBalanceDesc.dateTime = balance.dateTime;

        var taskList = [];
        var accountRef = balance.accountRef;

        taskList.push(
            this.accountService.get(accountRef.id)
                .then((account)=> {
                    localBalanceDesc.account = account;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                return LocalBalanceFactory.createNewBalance(localBalanceDesc);
            });
    }

    fromLocalConverter(localBalance:LocalBalance):Balance {
        var balance = new Balance();
        balance.accountRef = new AccountRef(localBalance.account.id);
        balance.balance = localBalance.balance;
        balance.closed = localBalance.closed;
        balance.comment = localBalance.comment;
        balance.dateTime = localBalance.dateTime;
        balance.id = localBalance.id;
        return balance;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}