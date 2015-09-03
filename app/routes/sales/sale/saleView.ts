/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View, NgIf, NgFor} from 'angular2/angular2';
import {Router, RouteParams, Location} from 'angular2/router';

import {LocalSale, LocalItemSale} from 'client/localDomain/sale';
import {LocalItemVariant} from 'client/localDomain/itemVariant';

import {Sale, SaleRef} from 'client/domain/sale';
import {Item, ItemRef} from 'client/domain/item';
import {ItemSale, ItemSaleSearch} from 'client/domain/itemSale';
import {Pos} from 'client/domain/pos';

import {ErrorService} from 'services/error';
import {SaleService} from 'services/sale';

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
    errorService:ErrorService;

    routeParams:RouteParams;
    router:Router;
    location:Location;

    sale:LocalSale;
    payStep:boolean;
    navigatingWithinSale:boolean;

    pos:Pos;

    language:string;

    constructor(saleService:SaleService, errorService:ErrorService,
                routeParams:RouteParams, router:Router, location:Location) {
        this.saleService = saleService;
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
        this.saleService.getLocalSaleAsync(id)
            .then((sale)=> {
                this.sale = sale;
                this.saleService.activeSale = sale;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onSaleEmptied() {
        this.saleService.removeLocalSaleAsync(this.sale)
            .then(()=> {
                this.sale = null;
                this.saleService.activeSale = null;
                this.router.navigate('/sales/sale/new');
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onItemClicked(item:LocalItemVariant) {
        var itemList = document.getElementById('saleItemList');
        itemList.focus();

        var nextTask = Promise.resolve(this.sale);
        var newSale = this.sale.id == null;
        if (this.sale.id == null) {
            nextTask = this.saleService.createLocalSaleAsync(this.sale);
        }
        nextTask.then((sale)=> {
            return this.saleService.addItemToLocalSaleAsync(this.sale, item);
        }).then((sale)=> {
            if (newSale) {
                this.saleService.activeSale = sale;
                this.navigatingWithinSale = true;
                this.router.navigate('/sales/sale/' + sale.id);
            }
        }).catch((error)=> {
            this.errorService.handleRequestError(error);
        });
    }


    onCommandValidated(validated:boolean, payView:PayView) {
        this.payStep = validated;
        payView.start();
    }

    onCommandPaid() {
        this.saleService.closeLocalSaleAsync(this.sale)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });

        this.saleService.activeSale = null;
        this.payStep = false;

        this.router.navigate('/sales/sale/new');
    }
}
