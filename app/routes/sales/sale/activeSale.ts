/**
 * Created by cghislai on 22/09/15.
 */

import {Inject} from 'angular2/angular2';

import {CompanyRef} from '../../../client/domain/company';
import {Sale, SaleRef, SaleClient} from '../../../client/domain/sale';
import {AccountClient, Account, AccountSearch} from '../../../client/domain/account';
import {AccountingEntryClient, AccountingEntry, AccountingEntrySearch} from '../../../client/domain/accountingEntry';
import {AccountingTransactionRef} from '../../../client/domain/accountingTransaction';
import {ItemVariantSale, ItemVariantSaleClient, ItemVariantSaleSearch} from '../../../client/domain/itemVariantSale';
import {Pos, PosRef} from '../../../client/domain/pos';

import {LocalAccount, LocalAccountFactory} from '../../../client/localDomain/account';
import {LocalAccountingEntry, LocalAccountingEntryFactory} from '../../../client/localDomain/accountingEntry';
import {LocalSale, LocalSaleFactory, NewSale} from '../../../client/localDomain/sale';
import {LocalItemVariant, LocalItemVariantFactory} from '../../../client/localDomain/itemVariant';
import {LocalItemVariantSale, LocalItemVariantSaleFactory, NewItemVariantSale} from '../../../client/localDomain/itemVariantSale';

import {SearchRequest, SearchResult} from '../../../client/utils/search';
import {LocaleTexts, LocaleTextsFactory} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';
import {BasicLocalService, BasicLocalServiceInfo} from '../../../services/basicService';
import {List, Map} from 'immutable';

export class ActiveSaleService {
    sale:LocalSale;
    saleItemsRequest:SearchRequest<LocalItemVariantSale>;
    saleItemsResult:SearchResult<LocalItemVariantSale>;
    pos:Pos;
    accountingEntriesRequest:SearchRequest<LocalAccountingEntry>;
    accountingEntriesResult:SearchResult<LocalAccountingEntry>;
    accountsRequest:SearchRequest<LocalAccount>;
    accountsResult:SearchResult<LocalAccount>;
    paidAmount:number;


    authService:AuthService;
    accountClient:AccountClient;
    accoutService:BasicLocalService<Account, LocalAccount>;
    accountingEntryClient:AccountingEntryClient;
    accountingEntryService:BasicLocalService<AccountingEntry, LocalAccountingEntry>;
    saleClient:SaleClient;
    saleService:BasicLocalService<Sale, LocalSale>;
    itemVariantSaleService:BasicLocalService<ItemVariantSale, LocalItemVariantSale>;

    constructor(authService:AuthService) {
        this.sale = null;
        this.pos = null;

        this.saleItemsRequest = new SearchRequest<LocalItemVariantSale>();
        var itemVariantSaleSearch = new ItemVariantSaleSearch();
        itemVariantSaleSearch.companyRef = authService.getEmployeeCompanyRef();
        this.saleItemsRequest.search = itemVariantSaleSearch;
        this.saleItemsResult = new SearchResult<LocalItemVariantSale>();

        this.accountingEntriesRequest = new SearchRequest<LocalAccountingEntry>();
        var accountingEntrySearch = new AccountingEntrySearch();
        accountingEntrySearch.companyRef = authService.getEmployeeCompanyRef();
        this.accountingEntriesRequest.search = accountingEntrySearch;
        this.accountingEntriesResult = new SearchResult<LocalAccountingEntry>();

        this.accountsRequest = new SearchRequest<LocalAccount>();
        var accountSearch = new AccountSearch();
        accountSearch.companyRef = authService.getEmployeeCompanyRef();
        this.accountsRequest.search = accountSearch;
        this.accountsResult = new SearchResult<LocalAccount>();

        this.authService = authService;
        this.accountClient = new AccountClient();
        var accountServiceInfo:BasicLocalServiceInfo<Account, LocalAccount> = <BasicLocalServiceInfo<Account, LocalAccount>>{
            client: this.accountClient,
            authService: authService,
            fromLocalConverter: LocalAccountFactory.fromLocalAccount,
            toLocalConverter: LocalAccountFactory.toLocalAccount
        };
        this.accoutService = new BasicLocalService<Account, LocalAccount>(accountServiceInfo);

        this.accountingEntryClient = new AccountingEntryClient();
        var accountingEntryServiceInfo:BasicLocalServiceInfo<AccountingEntry, LocalAccountingEntry> = <BasicLocalServiceInfo<AccountingEntry, LocalAccountingEntry>>{
            client: this.accountingEntryClient,
            authService: authService,
            fromLocalConverter: LocalAccountingEntryFactory.fromLocalAccountingEntry,
            toLocalConverter: LocalAccountingEntryFactory.toLocalAccountingEntry
        };
        this.accountingEntryService = new BasicLocalService<AccountingEntry, LocalAccountingEntry>(accountingEntryServiceInfo);

        this.saleClient = new SaleClient();
        var saleServiceInfo:BasicLocalServiceInfo<Sale, LocalSale> = <BasicLocalServiceInfo<Sale, LocalSale>>{
            client: this.saleClient,
            authService: authService,
            fromLocalConverter: LocalSaleFactory.fromLocalSale,
            toLocalConverter: LocalSaleFactory.toLocalSale
        };
        this.saleService = new BasicLocalService<Sale, LocalSale>(saleServiceInfo);

        var itemVariantSaleServiceInfo:BasicLocalServiceInfo<ItemVariantSale, LocalItemVariantSale> = <BasicLocalServiceInfo<ItemVariantSale, LocalItemVariantSale>>{
            client: new ItemVariantSaleClient(),
            authService: authService,
            fromLocalConverter: LocalItemVariantSaleFactory.fromLocalItemVariantSale,
            toLocalConverter: LocalItemVariantSaleFactory.toLocalItemVariantSale
        };
        this.itemVariantSaleService = new BasicLocalService<ItemVariantSale, LocalItemVariantSale>(itemVariantSaleServiceInfo);
    }

    public getSale(id:number):Promise<LocalSale> {
        return this.saleService.get(id)
            .then((sale)=> {
                if (sale == null) {
                    return this.getNewSale();
                }
                return sale;
            })
            .then((sale:LocalSale) => {
                this.sale = sale;
                var taskList:Promise<any>[] = <Promise<any>[]>[
                    this.searchPaidAmount(),
                    this.searchAccountingEntries(),
                    this.doSearchSaleItems()
                ];
                return Promise.all(taskList);
            })
            .then(()=> {
                return this.sale;
            });
    }

    public getNewSale():Promise<LocalSale> {
        var newSale = NewSale({
            company: this.authService.getEmployeeCompany(),
            discountRatio: 0
        });
        return Promise.resolve(newSale)
            .then((sale)=> {
                this.sale = sale;
                this.paidAmount = 0;
                this.accountingEntriesResult = new SearchResult<LocalAccountingEntry>();
                this.saleItemsResult = new SearchResult<LocalItemVariantSale>();
                return sale
            });
    }

    public doCancelSale():Promise<any> {
        return this.saleService.remove(this.sale).then(()=> {
            this.sale = null;
        });
    }

    public doSaveSale():Promise<LocalSale> {
        return this.saleService.save(this.sale)
            .then((ref)=> {
                return this.saleService.get(ref.id);
            }).then((sale:LocalSale)=> {
                this.sale = sale;
                return sale;
            });
    }


    public doCloseSale() {
        if (this.sale == null) {
            throw 'no sale';
        }
        if (this.sale.id == null) {
            throw 'Sale not saved';
        }
        var authToken = this.authService.authToken;
        return this.saleClient.closeSale(this.sale.id, authToken)
            .then(()=> {
                this.getNewSale();
            });
    }

    private updateSaleItem(fetchedItem:LocalItemVariantSale) {
        var listIndex = this.saleItemsResult.list.findIndex((item)=> {
            return item.itemVariant.id === fetchedItem.itemVariant.id;
        });
        if (listIndex < 0) {
            return;
        }
        this.saleItemsResult.list = this.saleItemsResult.list.set(listIndex, fetchedItem);
    }

    public fetchSaleAndItem(item:LocalItemVariantSale):Promise<any[]> {
        var taskList:Promise<any>[] = <Promise<any>[]>[
            this.saleService.get(this.sale.id).then((sale)=> {
                this.sale = sale;
            }),
            this.itemVariantSaleService.get(item.id)
                .then((fetchedItem)=> {
                    this.updateSaleItem(fetchedItem);
                })
        ];
        return Promise.all(taskList);
    }

    public doAddItem(itemVariant:LocalItemVariant):Promise<any> {
        if (this.sale == null) {
            throw 'no sale';
        }
        if (this.sale.id == null) {
            throw 'Sale not saved';
        }


        var itemSale:LocalItemVariantSale = this.saleItemsResult.list.find((itemSale)=> {
            return itemSale.itemVariant.id == itemVariant.id;
        });

        if (itemSale == null) {
            var itemSaleDesc:any = {
                comment: LocaleTextsFactory.toLocaleTexts({}),
                discountRatio: 0,
                itemVariant: itemVariant,
                quantity: 1,
                sale: this.sale,
                vatExclusive: LocalItemVariantFactory.calcPrice(itemVariant, false),
                vatRate: itemVariant.item.vatRate
            };
            itemSale = NewItemVariantSale(itemSaleDesc);

            if (this.saleItemsResult != null) {
                this.saleItemsResult.list = this.saleItemsResult.list.push(itemSale);
                this.saleItemsResult.count++;
            }
        } else {
            var oldQuantity = itemSale.quantity;
            var newQuantity = oldQuantity + 1;
            var itemSale = <LocalItemVariantSale>itemSale.set('quantity', newQuantity);
            this.updateSaleItem(itemSale);
        }
        return this.itemVariantSaleService.save(itemSale)
            .then((ref)=> {
                var newItemSale = <LocalItemVariantSale>itemSale.set('id', ref.id);
                return this.fetchSaleAndItem(newItemSale);
            });
    }

    public doRemoveItem(saleItem:LocalItemVariantSale):Promise<any> {
        var newItems = this.saleItemsResult.list.filter((item)=> {
            return item != saleItem;
        }).toList();
        this.saleItemsResult.list = newItems;

        return this.itemVariantSaleService.remove(saleItem)
            .then(()=> {
                var taskList:Promise<any>[] = [
                    this.saleService.get(this.sale.id).then((sale)=> {
                        this.sale = sale;
                    }),
                    this.doSearchSaleItems()
                ];
                return Promise.all(taskList);
            });
    }

    public doUpdateItem(saleItem:LocalItemVariantSale):Promise<any> {
        return this.itemVariantSaleService.save(saleItem)
            .then((ref)=> {
                saleItem = <LocalItemVariantSale>saleItem.set('id', ref.id);
                return this.fetchSaleAndItem(saleItem);
            });
        return Promise.resolve(saleItem);
    }

    public doSetSaleDiscountRatio(ratio:number):Promise<any> {
        var newSale = <LocalSale>this.sale.set('discountRatio', ratio);
        this.sale = newSale;
        return this.doUpdateSale();
    }

    private doUpdateSale():Promise<any> {
        return this.saleService.save(this.sale)
            .then((ref)=> {
                return this.saleService.get(ref.id);
            })
            .then((sale:LocalSale)=> {
                this.sale = sale;
            });
    }


    public doSearchSaleItems():Promise<any> {
        if (this.sale == null) {
            throw 'no sale';
        }
        if (this.sale.id == null) {
            throw 'Sale not saved';
        }
        var search = this.saleItemsRequest.search;
        var saleRef = new SaleRef(this.sale.id);
        search.saleRef = saleRef;
        return this.itemVariantSaleService.search(this.saleItemsRequest)
            .then((result)=> {
                this.saleItemsResult.list = result.list;
                this.saleItemsResult.count = result.count;
            });
    }

    public searchPaidAmount():Promise<any> {
        if (this.sale == null || this.sale.id == null) {
            throw "No saved sale";
        }
        return this.saleClient.getTotalPayed(this.sale.id, this.authService.authToken)
            .then((paid:number)=> {
                this.paidAmount = paid;
                return paid;
            });
    }

    public setPos(pos:Pos):Promise<any> {
        this.pos = pos;
        return this.searchAccounts();
    }

    public searchAccounts():Promise<any> {
        var search = this.accountsRequest.search;
        var posRef = new PosRef(this.pos.id);
        search.posRef = posRef;
        return this.accoutService.search(this.accountsRequest)
            .then((result)=> {
                this.accountsResult = result;
            });
    }

    public searchAccountingEntries():Promise<any> {
        var search = this.accountingEntriesRequest.search;
        search.accountingTransactionRef = this.sale.accountingTransactionRef;
        return this.accountingEntryService.search(this.accountingEntriesRequest)
            .then((result)=> {
                this.accountingEntriesResult = result;
            });
    }

    public doAddAccountingEntry(entry:LocalAccountingEntry):Promise<any> {
        this.accountingEntriesResult.list.push(entry);
        this.accountingEntriesResult.count++;

        return this.accountingEntryService.save(entry)
            .then(()=> {
                var taskLlist:Promise<any> [] = <Promise<any>[]>[
                    this.searchPaidAmount(),
                    this.searchAccountingEntries()
                ];
                return Promise.all(taskLlist);
            });

    }

    public doRemoveAccountingEntry(entry:LocalAccountingEntry):Promise<any> {
        return this.accountingEntryService.remove(entry)
            .then(()=> {
                var taskLlist:Promise<any> [] = <Promise<any>[]>[
                    this.searchPaidAmount(),
                    this.searchAccountingEntries()
                ];
                return Promise.all(taskLlist);
            });

    }


    public getSaleTotalAmount() {
        if (this.sale == null) {
            return 0;
        }
        var total = this.sale.vatExclusiveAmount + this.sale.vatAmount;
        return total;
    }
}