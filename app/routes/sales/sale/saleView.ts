/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View, NgIf, NgFor} from 'angular2/angular2';
import {Router, RouteParams, Location} from 'angular2/router';

import {LocalSale} from 'client/localDomain/sale';
import {LocalItemVariantSale} from 'client/localDomain/itemVariantSale';
import {LocalItemVariant} from 'client/localDomain/itemVariant';

import {Sale, SaleRef} from 'client/domain/sale';
import {Item, ItemRef} from 'client/domain/item';
import {Pos} from 'client/domain/pos';
import {LocaleTexts} from 'client/utils/lang';

import {ErrorService} from 'services/error';
import {SaleService} from 'services/sale';
import {AuthService} from 'services/auth';
import {ItemVariantSaleService} from 'services/itemVariantSale';

import {ItemListView} from 'components/sales/sale/itemList/listView';
import {CommandView} from 'components/sales/sale/commandView/commandView';
import {PayView} from 'components/sales/sale/payView/payView'
import {PosSelect} from 'components/pos/posSelect/posSelect';

@Component({
    selector: 'saleView'
})
@View({
    templateUrl: './routes/sales/sale/saleView.html',
    styleUrls: ['./routes/sales/sale/saleView.css'],
    directives: [ItemListView, CommandView, PayView, NgIf, NgFor, PosSelect]
})

export class SaleView {
    saleService:SaleService;
    itemVariantSaleService:ItemVariantSaleService;
    errorService:ErrorService;
    authService:AuthService;

    routeParams:RouteParams;
    router:Router;
    location:Location;

    sale:LocalSale;
    navigatingWithinSale:boolean;
    payStep:boolean;

    pos:Pos;

    language:string;

    constructor(saleService:SaleService, errorService:ErrorService, itemVariantSaleService:ItemVariantSaleService,
                authService:AuthService,
                routeParams:RouteParams, router:Router, location:Location) {
        this.saleService = saleService;
        this.authService = authService;
        this.itemVariantSaleService = itemVariantSaleService;
        this.errorService = errorService;

        this.routeParams = routeParams;
        this.router = router;
        this.location = location;
    }

    onActivate() {
        this.findSale();
    }

    canReuse() {
        return this.navigatingWithinSale;
    }

    onReuse() {
        this.navigatingWithinSale = false;
    }

    get saleClosed(): boolean{
        var closed: boolean =  this.sale != null && this.sale.closed;
        return closed;
    }

    get newSale(): boolean{
        return this.sale != null && this.sale.id == null;
    }

    private findSale() {
        var path = this.location.path();

        if (this.routeParams != null && this.routeParams.params != null) {
            var idParam = this.routeParams.get('id');
            var id = parseInt(idParam);
            if (isNaN(id)) {
                if (idParam == 'new') {
                    this.getNewSale();
                    return;
                }
                if (idParam == 'active') {
                    this.getActiveSale();
                    return;
                }
                this.getActiveSale();
                return;
            }
            this.getSale(id);
        } else {
            this.getNewSale();
        }
    }

    private getActiveSale() {
        var activeSale = this.saleService.activeSale;
        if (activeSale == null) {
            this.router.navigate('/sales/sale/new');
            return;
        }
        this.router.navigate('/sales/sale/' + activeSale.id);
    }

    private getNewSale() {
        this.payStep = false;
        if (this.sale == null) {
            this.sale = new LocalSale();
        } else {
            if (this.sale.id != null) {
                this.sale = new LocalSale();
            }
        }
        this.saleService.activeSale = null;
    }

    private getSale(id) {
        if (this.sale != null) {
            if (this.sale.id == id) {
                return;
            }
        }
        this.saleService.get(id)
            .then((sale)=> {
                this.sale = sale;
                if (sale.closed) {
                    this.payStep = true;
                } else {
                    this.saleService.activeSale = sale;
                }
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onSaleEmptied() {
        this.saleService.remove(this.sale)
            .then(()=> {
                this.sale = null;
                this.saleService.activeSale = null;
                this.router.navigate('/sales/sale/new');
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onItemClicked(item:LocalItemVariant, commandView:CommandView) {
        var itemList = document.getElementById('saleItemList');
        itemList.focus();

        if (this.newSale) {
            this.sale.company = this.authService.auth.employee.company;
            this.sale.discountRatio = 0;

            return this.saleService.save(this.sale)
                .then((sale)=> {
                    this.saleService.activeSale = sale;
                    this.navigatingWithinSale = true;
                    this.sale = sale;
                    return commandView.doAddItem(item);
                }).then(()=>{
                    this.router.navigate('/sales/sale/' + this.sale.id);
                });
        }
        commandView.doAddItem(item);
    }

    onCommandValidated(validated:boolean, payView:PayView) {
        this.payStep = validated;
        if (validated) {
            payView.searchTotalPaid();
        }
    }

    onCommandPaid() {
        this.saleService.closeSale(this.sale)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });

        this.sale = null;
        this.saleService.activeSale = null;
        this.payStep = false;

        this.router.navigate('/sales/sale/new');
    }
}
