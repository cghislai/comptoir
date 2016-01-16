/**
 * Created by cghislai on 29/07/15.
 */
import {Injectable} from 'angular2/core';

import {MoneyPile, MoneyPileRef, MoneyPileFactory} from '../client/domain/moneyPile';
import {Account, AccountType, AccountRef} from '../client/domain/account';
import {BalanceRef} from '../client/domain/balance';

import {LocalMoneyPile, LocalMoneyPileFactory} from '../client/localDomain/moneyPile';
import {LocalAccount} from '../client/localDomain/account';

import {WithId} from '../client/utils/withId';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {MoneyPileClient} from '../client/moneyPile';

import {AuthService} from './auth';
import {AccountService} from './account';
import {BalanceService} from './balance';


@Injectable()
export class MoneyPileService {
    private moneyPileClient:MoneyPileClient;
    private authService:AuthService;
    private accountService:AccountService;
    private balanceService:BalanceService;


    constructor(moneyPileClient:MoneyPileClient,
                authService:AuthService,
                accountService:AccountService,
                balanceService:BalanceService) {
        this.moneyPileClient = moneyPileClient;
        this.authService = authService;
        this.accountService = accountService;
        this.balanceService = balanceService;
    }

    get(id:number):Promise<LocalMoneyPile> {
        return this.moneyPileClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:MoneyPile)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.moneyPileClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalMoneyPile):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.moneyPileClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalMoneyPile>):Promise<SearchResult<LocalMoneyPile>> {
        return this.moneyPileClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<MoneyPile>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalMoneyPile>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(moneyPile:MoneyPile):Promise<LocalMoneyPile> {
        var localMoneyPileDesc:any = {};
        localMoneyPileDesc.unitCount = moneyPile.count;
        localMoneyPileDesc.dateTime = moneyPile.dateTime;
        localMoneyPileDesc.id = moneyPile.id;
        localMoneyPileDesc.total = moneyPile.total;
        localMoneyPileDesc.unitAmount = moneyPile.unitAmount;

        var taskList = [];
        var accountRef = moneyPile.accountRef;


        taskList.push(
            this.accountService.get(accountRef.id)
                .then((localAccount)=> {
                    localMoneyPileDesc.account = localAccount;
                })
        );
        var balanceRef = moneyPile.balanceRef;
        taskList.push(
            this.balanceService.get(balanceRef.id)
                .then((localBalance)=> {
                    localMoneyPileDesc.balance = localBalance;
                })
        );

        return Promise.all(taskList)
            .then(()=> {
                return LocalMoneyPileFactory.createNewMoneyPile(localMoneyPileDesc);
            });
    }


    fromLocalConverter(localMoneyPile:LocalMoneyPile):MoneyPile {
        var moneyPile = new MoneyPile();
        moneyPile.accountRef = new AccountRef(localMoneyPile.account.id);
        moneyPile.balanceRef = new BalanceRef(localMoneyPile.balance.id);
        moneyPile.count = localMoneyPile.unitCount;
        moneyPile.dateTime = localMoneyPile.dateTime;
        moneyPile.id = localMoneyPile.id;
        moneyPile.total = localMoneyPile.total;
        moneyPile.unitAmount = localMoneyPile.unitAmount;
        return moneyPile;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}