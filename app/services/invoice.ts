/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from 'angular2/core';

import {Invoice, InvoiceRef, InvoiceSearch, InvoiceFactory} from '../client/domain/invoice';
import {CompanyRef} from '../client/domain/company';
import {SaleRef} from '../client/domain/sale';

import {LocalInvoice, LocalInvoiceFactory} from '../client/localDomain/invoice';
import {LocalAccount} from '../client/localDomain/account';

import {WithId} from '../client/utils/withId';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {InvoiceClient} from '../client/invoice';

import {AuthService} from './auth';
import {CompanyService} from './company';
import {SaleService} from './sale';

@Injectable()
export class InvoiceService {

    invoiceClient:InvoiceClient;
    authService:AuthService;
    companyService:CompanyService;
    saleService:SaleService;

    constructor(invoiceClient:InvoiceClient,
                authService:AuthService,
                companyService:CompanyService,
                saleService:SaleService) {
        this.invoiceClient = invoiceClient;
        this.authService = authService;
        this.companyService = companyService;
        this.saleService = saleService;
    }

    get(id:number):Promise<LocalInvoice> {
        return this.invoiceClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:Invoice)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.invoiceClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalInvoice):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.invoiceClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalInvoice>):Promise<SearchResult<LocalInvoice>> {
        return this.invoiceClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<Invoice>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalInvoice>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(invoice:Invoice):Promise<LocalInvoice> {
        var localInvoiceDesc:any = {};
        localInvoiceDesc.id = invoice.id;
        localInvoiceDesc.note = invoice.note;
        localInvoiceDesc.number = invoice.number;

        var taskList = [];

        var companyRef = invoice.companyRef;
        taskList.push(
            this.companyService.get(companyRef.id, this.getAuthToken())
                .then((localCompany)=> {
                    localInvoiceDesc.company = localCompany;
                })
        );

        var saleRef = invoice.saleRef;
        taskList.push(
            this.saleService.get(saleRef.id)
                .then((sale)=> {
                    localInvoiceDesc.sale = sale;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                return LocalInvoiceFactory.createNewInvoice(localInvoiceDesc);
            });
    }

    fromLocalConverter(localInvoice:LocalInvoice):Invoice {
        var invoice = new Invoice();
        ;
        if (localInvoice.company != null) {
            invoice.companyRef = new CompanyRef(localInvoice.company.id);
        }
        invoice.id = localInvoice.id;
        invoice.note = localInvoice.note;
        invoice.number = localInvoice.number;
        if (localInvoice.sale != null) {
            invoice.saleRef = new SaleRef(localInvoice.sale.id);
        }
        return invoice;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}