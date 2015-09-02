/**
 * Created by cghislai on 06/08/15.
 */
import {Inject, forwardRef} from 'angular2/angular2';

import {LocalAccount, LocalAccountFactory} from 'client/localDomain/account';
import {LocalItemSale, LocalSale,LocalSaleFactory} from 'client/localDomain/sale';
import {LocalItemVariant, LocalItemVariantFactory} from 'client/localDomain/itemVariant';
import {LocalAccountingEntry, LocalAccountingEntryFactory} from 'client/localDomain/accountingEntry';

import {Account, AccountFactory} from 'client/domain/account';
import {AccountingEntry, AccountingEntryRef, AccountingEntrySearch,  AccountingEntryFactory} from 'client/domain/accountingEntry';
import {Sale, SaleRef, SaleSearch, SaleFactory} from 'client/domain/sale';
import {ItemVariant, ItemVariantRef, ItemVariantFactory} from 'client/domain/itemVariant';
import {ItemSale, ItemSaleRef, ItemSaleSearch, ItemSaleFactory} from 'client/domain/itemSale';

import {AccountClient} from 'client/account';
import {SaleClient} from 'client/sale';
import {ItemSaleClient} from 'client/itemSale';
import {ItemVariantClient} from 'client/itemVariant';
import {AccountingEntryClient} from 'client/accountingEntry';

import {LocaleTexts} from 'client/utils/lang';
import {SearchResult} from 'client/utils/search';
import {Pagination} from 'client/utils/pagination';
import {NumberUtils} from 'client/utils/number';
import {ComptoirRequest, ComptoirResponse} from 'client/utils/request';

import {AuthService} from 'services/auth';
import {ItemVariantService} from 'services/itemVariant';

export class SaleService {
    accountClient:AccountClient;
    saleClient:SaleClient;
    itemSaleClient:ItemSaleClient;
    itemVariantClient:ItemVariantClient;
    accountingEntryClient:AccountingEntryClient;

    authService:AuthService;
    itemVariantService:ItemVariantService;
    activeSale:Sale;

    constructor(@Inject authService:AuthService, @Inject itemVariantService:ItemVariantService) {
        this.authService = authService;
        this.itemVariantService = itemVariantService;

        this.accountClient = new AccountClient();
        this.saleClient = new SaleClient();
        this.itemSaleClient = new ItemSaleClient();
        this.itemVariantClient = new ItemVariantClient();
        this.accountingEntryClient = new AccountingEntryClient();
    }


    createSale(sale:Sale):Promise<SaleRef> {
        var authToken = this.authService.authToken;
        sale.companyRef = this.authService.loggedEmployee.companyRef;
        return this.saleClient.createSale(sale, authToken);
    }

    updateSale(sale:Sale):Promise<SaleRef> {
        var authToken = this.authService.authToken;
        return this.saleClient.updateSale(sale, authToken);
    }

    getSale(id:number):Promise<Sale> {
        var authToken = this.authService.authToken;
        return this.saleClient.getSale(id, authToken);
    }

    searchSales(saleSearch:SaleSearch, pagination:Pagination):Promise<SearchResult<Sale>> {
        var authToken = this.authService.authToken;
        saleSearch.companyRef = this.authService.loggedEmployee.companyRef;
        return this.saleClient.searchSales(saleSearch, pagination, authToken);
    }

    removeSale(id:number):Promise<boolean> {
        var authToken = this.authService.authToken;
        return this.saleClient.deleteSale(id, authToken)
            .then(()=> {
                return true;
            });
    }


    // Local sales

    public getLocalSaleAsync(saleId:number):Promise<LocalSale> {
        return this.getSale(saleId)
            .then((sale)=> {
                var localSale = LocalSaleFactory.toLocalSale(sale);
                localSale.dirty = true;

                this.fetchLocalSaleItemsAsync(localSale).then(()=> {
                    localSale.dirty = false;
                });
                return localSale;
            });
    }

    public updateLocalSaleAsync(localSale:LocalSale):Promise<LocalSale> {
        if (localSale.saleRequest != null) {
            localSale.saleRequest.discardRequest();
        }

        var authToken = this.authService.authToken;
        localSale.dirty = true;
        localSale.saleRequest = this.saleClient.getGetSaleRequest(localSale.id, authToken);
        return localSale.saleRequest.run()
            .then((response:ComptoirResponse)=> {
                var sale = JSON.parse(response.text, SaleFactory.fromJSONSaleReviver);
                LocalSaleFactory.updateLocalSale(localSale, sale);
                localSale.dirty = false;
                localSale.saleRequest = null;
                return localSale;
            });
    }

    public closeLocalSaleAsync(localSale:LocalSale):Promise<LocalSale> {
        if (localSale.closed) {
            throw 'sale already closed';
        }

        if (localSale.saleRequest != null) {
            localSale.saleRequest.discardRequest();
        }
        localSale.dirty = true;
        var sale = LocalSaleFactory.fromLocalSale(localSale);
        var authToken = this.authService.authToken;
        return this.saleClient.closeSale(localSale.id, authToken)
            .then(()=> {
                localSale.dirty = false;
                localSale.saleRequest = null;
                return this.updateLocalSaleAsync(localSale);
            });
    }


    public removeLocalSaleAsync(localSale:LocalSale):Promise<any> {
        return this.removeSale(localSale.id);
    }

    public addItemToLocalSaleAsync(localSale:LocalSale, itemVariant:LocalItemVariant):Promise<LocalSale> {
        for (var existingItem of localSale.items) {
            var itemId = existingItem.itemVariant.id;
            if (itemId == itemVariant.id) {
                existingItem.quantity = existingItem.quantity + 1;
                return this.updateLocalSaleItemAsync(existingItem);
            }
        }

        var localItemSale = new LocalItemSale();
        localItemSale.discountRatio = 0;
        localItemSale.itemVariant = itemVariant;
        localItemSale.quantity = 1;
        localItemSale.sale = localSale;
        localSale.items.push(localItemSale);
        var itemSale = LocalSaleFactory.fromLocalItemSale(localItemSale);
        var authToken = this.authService.authToken;

        localSale.dirty = true;
        localItemSale.dirty = true;
        localItemSale.itemSaleRequest = this.itemSaleClient.getCreateItemSaleRequest(itemSale, authToken);
        return localItemSale.itemSaleRequest.run()
            .then((response: ComptoirResponse)=> {
                var itemSaleRef:ItemSaleRef = JSON.parse(response.text);
                var itemSaleId = itemSaleRef.id;
                localItemSale.id = itemSaleId;

                localSale.dirty = false;
                localItemSale.dirty = false;
                localItemSale.itemSaleRequest = null;
                return this.updateLocalSaleAsync(localSale);
            });
    }

    public removeItemFromLocalSaleAsync(localSale:LocalSale, itemVariant:LocalItemVariant):Promise<LocalSale> {
        for (var existingItem of localSale.items) {
            var itemId = existingItem.itemVariant.id;
            if (itemId == itemVariant.id) {
                existingItem.quantity = existingItem.quantity - 1;
                if (existingItem.quantity <= 0) {
                    return this.removeLocalItemSaleAsync(existingItem);
                } else {
                    return this.updateLocalSaleItemAsync(existingItem);
                }
            }
        }
    }


    public updateLocalSaleItemAsync(localItemSale:LocalItemSale):Promise<LocalSale> {
        if (localItemSale.itemSaleRequest != null) {
            localItemSale.itemSaleRequest.discardRequest();
        }
        var itemSale = LocalSaleFactory.fromLocalItemSale(localItemSale);
        var authToken = this.authService.authToken;
        localItemSale.dirty = true;
        localItemSale.itemSaleRequest = this.itemSaleClient.getUpdateItemSaleRequest(itemSale, authToken);
        return localItemSale.itemSaleRequest.run()
            .then(()=> {
                localItemSale.dirty = false;
                localItemSale.itemSaleRequest = null;
                return this.updateLocalSaleAsync(localItemSale.sale);
            });
    }

    public updateLocalSalePaidAmountAsync(localSale:LocalSale):Promise<LocalSale> {
        if (localSale.totalPaidRequest != null) {
            localSale.totalPaidRequest.discardRequest();
        }
        var authToken = this.authService.authToken;
        localSale.dirty = true;
        localSale.totalPaidRequest = this.saleClient.getGetTotalPayedRequest(localSale.id, authToken);
        return localSale.totalPaidRequest.run()
            .then((response:ComptoirResponse)=> {
                var value = JSON.parse(response.text);
                var paid = NumberUtils.toFixedDecimals(value.value, 2);
                localSale.totalPaid = paid;
                localSale.totalPaidRequest = null;
                localSale.dirty = false;
                return localSale;
            });
    }

    public addAccountingEntryToLocalSaleAsync(localSale:LocalSale, localAccountingEntry:LocalAccountingEntry):Promise<LocalSale> {
        localAccountingEntry.accountingTransactionRef = localSale.accountingTransactionRef;
        localAccountingEntry.companyRef = this.authService.loggedEmployee.companyRef;
        var authToken = this.authService.authToken;

        if (localSale.accountingEntriesRequest != null) {
            localSale.accountingEntriesRequest.discardRequest();
        }
        var accountingEntry = LocalAccountingEntryFactory.fromLocalAccountingEntry(localAccountingEntry);
        localSale.dirty = true;
        localSale.accountingEntriesRequest = this.accountingEntryClient.getCreateAccountingEntryRequest(accountingEntry, authToken);
        localSale.accountingEntries.push(localAccountingEntry);

        return localSale.accountingEntriesRequest.run()
            .then((response:ComptoirResponse)=> {
                var entryRef:AccountingEntryRef = JSON.parse(response.text);
                localAccountingEntry.id = entryRef.id;
                localSale.dirty = false;
                localSale.accountingEntriesRequest = null;
                return this.updateLocalSalePaidAmountAsync(localSale);
            });
    }

    public updateLocalSaleAccountingEntry(localSale: LocalSale, localAccountingEntry: LocalAccountingEntry) : Promise<LocalSale>{
        localAccountingEntry.companyRef = this.authService.loggedEmployee.companyRef;
        var authToken = this.authService.authToken;

        if (localSale.accountingEntriesRequest != null) {
            localSale.accountingEntriesRequest.discardRequest();
        }
        var accountingEntry = LocalAccountingEntryFactory.fromLocalAccountingEntry(localAccountingEntry);
        localSale.dirty = true;
        localSale.accountingEntriesRequest = this.accountingEntryClient.getUpdateAccountingEntryRequest(accountingEntry, authToken);

        return localSale.accountingEntriesRequest.run()
            .then((response:ComptoirResponse)=> {
                localSale.dirty = false;
                localSale.accountingEntriesRequest = null;
                return this.updateLocalSalePaidAmountAsync(localSale);
            });
    }

    public removeLocalSaleAccountingEntry(localSale: LocalSale, localAccountingEntry: LocalAccountingEntry): Promise<LocalSale> {
        localAccountingEntry.companyRef = this.authService.loggedEmployee.companyRef;
        var authToken = this.authService.authToken;

        if (localSale.accountingEntriesRequest != null) {
            localSale.accountingEntriesRequest.discardRequest();
        }

        var newEntries = [];
        for (var entry of localSale.accountingEntries) {
            if (entry.id = localAccountingEntry.id) {
                continue;
            }
            newEntries.push(entry);
        }
        localSale.accountingEntries = newEntries;

        localSale.dirty = true;
        localSale.accountingEntriesRequest = this.accountingEntryClient.getDeleteAccountingEntryRequest(localAccountingEntry.id, authToken);

        return localSale.accountingEntriesRequest.run()
            .then((response:ComptoirResponse)=> {
                localSale.dirty = false;
                localSale.accountingEntriesRequest = null;
                return this.updateLocalSalePaidAmountAsync(localSale);
            });
    }

    public getLocalSaleAccountingEntriesAsync(localSale:LocalSale):Promise<LocalSale> {
        if (localSale.accountingEntriesRequest != null) {
            localSale.accountingEntriesRequest.discardRequest();
        }

        var entrySearch = new AccountingEntrySearch();
        var authToken = this.authService.authToken;
        entrySearch.accountingTransactionRef = localSale.accountingTransactionRef;

        localSale.dirty = true;
        localSale.accountingEntriesRequest = this.accountingEntryClient.getSearchAccountingEntriesRequest(entrySearch, null, authToken);

        return localSale.accountingEntriesRequest.run()
            .then((response:ComptoirResponse)=> {
                var result = new SearchResult<AccountingEntry>();
                result.parseResponse(response, AccountingEntryFactory.fromJSONAccountingEntryReviver);

                localSale.accountingEntries = [];
                var entriesTasks = [];
                for (var accountingEntry of result.list) {
                    var localEntry = LocalAccountingEntryFactory.toLocalAccountingEntry(accountingEntry);
                    localSale.accountingEntries.push(localEntry);
                    entriesTasks.push(this.fetchLocalAccountingEntryAccount(localEntry, accountingEntry.accountRef.id));
                }
                localSale.accountingEntriesRequest = null;
                localSale.dirty = false;
                return Promise.all(entriesTasks);
            }).then(()=> {
                return localSale;
            });
    }

    private fetchLocalAccountingEntryAccount(localAccountingEntry:LocalAccountingEntry, accountId:number):Promise<LocalAccountingEntry> {
        // Account wont change, just return if it is present already
        if (localAccountingEntry.accountRequest != null) {
            return Promise.resolve(localAccountingEntry);
        }
        if (localAccountingEntry.account != null) {
            return Promise.resolve(localAccountingEntry);
        }
        var authToken = this.authService.authToken;
        localAccountingEntry.accountRequest = this.accountClient.getGetAccountRequest(accountId, authToken);
        return localAccountingEntry.accountRequest.run()
            .then((response:ComptoirResponse)=> {
                var account = JSON.parse(response.text, AccountFactory.fromJSONAccountReviver);
                var localAccount = LocalAccountFactory.toLocalAccount(account);
                localAccountingEntry.account = localAccount;
                localAccountingEntry.accountRequest = null;
                return localAccountingEntry;
            });
    }


    private fetchLocalSaleItemsAsync(localSale:LocalSale):Promise<LocalSale> {
        if (localSale.itemsRequest != null) {
            localSale.itemsRequest.discardRequest();
        }
        var authToken = this.authService.authToken;
        var saleId = localSale.id;
        var itemSaleSearch = new ItemSaleSearch();
        itemSaleSearch.saleRef = new SaleRef(saleId);

        localSale.itemsRequest = this.itemSaleClient.getSearchItemSalesRequest(itemSaleSearch, null, authToken);
        return localSale.itemsRequest.run()
            .then((response:ComptoirResponse)=> {
                var result = new SearchResult<ItemSale>();
                result.parseResponse(response, ItemSaleFactory.fromJSONItemSaleReviver);
                return this.updateLocalSaleItemListAsync(localSale, result.list);
            });
    }

    private updateLocalSaleItemListAsync(localSale:LocalSale, items:ItemSale[]):Promise<LocalSale> {
        var currentItems = localSale.items;
        var newItems:LocalItemSale[] = [];
        var currentItemMap = {};
        for (var localItem of currentItems) {
            var itemId = localItem.id;
            currentItemMap[itemId] = localItem;
        }
        var fetchItemTasks = [];

        for (var itemSale of items) {
            var itemSaleId = itemSale.id;
            var existingItem = currentItemMap[itemSaleId];
            if (existingItem != null) {
                LocalSaleFactory.updateLocalItemSale(existingItem, itemSale);
                newItems.push(existingItem);
            } else {
                var localItemSale = LocalSaleFactory.toLocalItemSale(itemSale);
                newItems.push(localItemSale);
                fetchItemTasks.push(this.fetchLocalItemSaleItemVariantAsync(localItemSale, itemSale.itemVariantRef.id));
            }
        }
        localSale.items = newItems;

        return Promise.all(fetchItemTasks)
            .then(()=> {
                return localSale;
            });
    }

    private fetchLocalItemSaleItemVariantAsync(localSaleItem:LocalItemSale, itemVariantId:number):Promise<LocalItemVariant> {
        if (localSaleItem.itemVariantRequest != null) {
            localSaleItem.itemVariantRequest.discardRequest();
        }
        var authToken = this.authService.authToken;
        localSaleItem.itemVariantRequest = this.itemVariantClient.getGetItemVariantRequest(itemVariantId, authToken);
        return localSaleItem.itemVariantRequest.run()
            .then((response:ComptoirResponse)=> {
                var itemVariant = JSON.parse(response.text, ItemVariantFactory.fromJSONItemVariantReviver);
                var localItemVariant = LocalItemVariantFactory.toLocalItemVariant(itemVariant);
                localSaleItem.itemVariant = itemVariant;
                localSaleItem.itemVariantRequest = null;
                return this.itemVariantService.updateLocalItemVariantAsync(localItemVariant, itemVariant);
            });
    }

    private removeLocalItemSaleAsync(localItemSale:LocalItemSale):Promise<LocalSale> {
        if (localItemSale.itemSaleRequest != null) {
            localItemSale.itemSaleRequest.discardRequest();
        }
        var localSale = localItemSale.sale;

        var newItems:LocalItemSale[] = [];
        for (var exitingItem of localSale.items) {
            if (exitingItem.id == localItemSale.id) {
                continue;
            }
            newItems.push(exitingItem);
        }
        localSale.items = newItems;

        var itemSaleId = localItemSale.id;
        var authToken = this.authService.authToken;
        localItemSale.dirty = true;
        localItemSale.itemSaleRequest = this.itemSaleClient.getRemoveItemSaleRequest(itemSaleId, authToken);
        return localItemSale.itemSaleRequest.run()
            .then(()=> {
                return this.updateLocalSaleAsync(localSale);
            });
    }

}