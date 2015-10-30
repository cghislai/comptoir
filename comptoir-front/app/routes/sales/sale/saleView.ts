/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View, NgIf, OnInit} from 'angular2/angular2';
import {Router, RouteParams, Location} from 'angular2/router';

import {LocalSale, NewSale} from 'client/localDomain/sale';
import {LocalItemVariantSale} from 'client/localDomain/itemVariantSale';
import {LocalItemVariant} from 'client/localDomain/itemVariant';

import {Sale, SaleRef} from 'client/domain/sale';
import {Item, ItemRef} from 'client/domain/item';
import {Pos} from 'client/domain/pos';
import {LocaleTexts} from 'client/utils/lang';

import {ErrorService} from 'services/error';
import {SaleService} from 'services/sale';
import {ActiveSaleService} from 'routes/sales/sale/activeSale';
import {AuthService} from 'services/auth';

import {ItemListView} from 'components/sales/sale/itemList/listView';
import {CommandView} from 'components/sales/sale/commandView/commandView';
import {PayView} from 'components/sales/sale/payView/payView'
import {PosSelect} from 'components/pos/posSelect/posSelect';

@Component({
    selector: 'saleView',
    bindings: [ActiveSaleService]
})
@View({
    templateUrl: './routes/sales/sale/saleView.html',
    styleUrls: ['./routes/sales/sale/saleView.css'],
    directives: [ItemListView, CommandView, PayView, NgIf, PosSelect]
})

export class SaleView {
    activeSaleService:ActiveSaleService;
    errorService:ErrorService;
    authService:AuthService;
    saleService: SaleService;

    routeParams:RouteParams;
    router:Router;
    location:Location;

    navigatingWithinSale:boolean;
    payStep: boolean;

    language:string;

    constructor(activeSaleService:ActiveSaleService, errorService:ErrorService,
                authService:AuthService, saleService: SaleService,
                routeParams:RouteParams, router:Router, location:Location) {
        this.activeSaleService = activeSaleService;
        this.authService = authService;
        this.errorService = errorService;
        this.saleService = saleService;

        this.routeParams = routeParams;
        this.router = router;
        this.location = location;

        this.navigatingWithinSale = false;
    }

    onActivate() {
        return this.findSale()
            .then((sale)=>{
                if (sale.closed) {
                    this.payStep = true;
                } else {
                    this.payStep = false;
                }
                this.saleService.activeSale = sale;
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    canReuse() {
        return false;
        //return this.navigatingWithinSale;
    }

    onReuse() {

    }

    get saleClosed():boolean {
        if (this.activeSaleService == null) {
            return false;
        }
        var sale = this.activeSaleService.sale;
        var closed:boolean = sale != null && sale.closed == true;
        return closed;
    }

    get newSale():boolean {
        if (this.activeSaleService == null) {
            return false;
        }
        var sale = this.activeSaleService.sale;
        return sale != null && sale.id == null;
    }

    private findSale():Promise<any> {
        if (this.routeParams != null && this.routeParams.params != null) {
            var idParam = this.routeParams.get('id');
            var id = parseInt(idParam);
            if (isNaN(id)) {
                if (idParam == 'new') {
                    return this.activeSaleService.getNewSale();
                }
                if (idParam == 'active') {
                    return this.getActiveSale();
                }
                return this.getActiveSale();
            }
            return this.activeSaleService.getSale(id);
        } else {
            return this.activeSaleService.getNewSale();
        }
    }

    private getActiveSale():Promise<LocalSale> {
        var activeSale = this.saleService.activeSale;

        var saleTask: Promise<LocalSale>;
        if (activeSale != null) {
            saleTask = Promise.resolve(activeSale);
        } else {
            saleTask =this.activeSaleService.getNewSale();
        }
        return saleTask
            .then((sale)=> {
                var saleId = sale.id;
                // update url
                if (saleId == null) {
                    var instruction = this.router.generate(['../Sale', {id: 'new'}]);
                    this.router.navigateInstruction(instruction, false);
                } else {
                    var instruction = this.router.generate(['../Sale', {id: saleId}]);
                    this.router.navigateInstruction(instruction, false);
                }
                return sale;
            });
    }

    onPosChanged(pos) {
        this.activeSaleService.setPos(pos)
        .catch((error)=>{
                this.errorService.handleRequestError(error);
            });
    }

    onSaleEmptied() {
        this.activeSaleService.doCancelSale()
            .then(()=> {
                this.router.navigate('/sales/sale/new');
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onItemClicked(item:LocalItemVariant) {
        var itemList = document.getElementById('saleItemList');
        itemList.focus();

        if (this.newSale) {
            return this.activeSaleService.doSaveSale()
                .then((sale)=> {
                    this.saleService.activeSale = sale;
                    return this.activeSaleService.doAddItem(item);
                }).then(()=> {
                    // this.navigatingWithinSale = true;
                    var saleId = this.activeSaleService.sale.id;
                    this.location.go('/sales/sale/' + saleId);
                })
                .catch((error)=> {
                    this.errorService.handleRequestError(error);
                });
        }
        this.activeSaleService.doAddItem(item)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onCommandPaid() {
        this.payStep = false;
        this.router.navigate('/sales/sale/new');
    }

    onValidateChanged(validated){
        this.payStep = validated;
    }
}
