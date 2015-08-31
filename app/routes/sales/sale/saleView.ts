/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View, NgIf, NgFor} from 'angular2/angular2';
import {Router, RouteParams, Location} from 'angular2/router';

import {Sale, SaleRef} from 'client/domain/sale';
import {Item, ItemRef} from 'client/domain/item';
import {ItemSale, ItemSaleSearch} from 'client/domain/itemSale';
import {Pos} from 'client/domain/pos';

import {ASale, ASaleItem} from 'client/utils/aSale';

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
    location: Location;

    aSale:ASale;
    payStep:boolean;
    saleClosed:boolean;
    navigatingWithinSale: boolean;

    pos:Pos;

    language:string;

    constructor(saleService:SaleService, errorService:ErrorService,
                routeParams:RouteParams, router: Router, location: Location) {
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
        if (path.indexOf('/new') >= 0) {
            this.getNewSale();
            return;
        }
        if (path.indexOf('/active') >= 0) {
            this.getActiveSale();
            return;
        }
        if (this.routeParams != null && this.routeParams.params != null) {
            var idParam = this.routeParams.get('id');
            var id = parseInt(idParam);
            if (isNaN(id)) {
                this.router.navigate('/sales/new');
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
            this.router.navigate('/sales/new');
            return;
        }
        this.router.navigate('/sales/sale/'+activeSale.id);
    }

    private getNewSale() {
        if (this.aSale == null) {
            this.aSale = this.saleService.createASale();
        } else {
            if (this.aSale.saleId != null) {
                this.aSale = this.saleService.createASale();
            }
        }
        this.saleService.activeSale = null;
        this.checkSaleClosed();
    }

    private getSale(id) {
        if (this.aSale != null) {
            if (this.aSale.saleId == id) {
                 return;
            }
        }
        var aSale = this.saleService.createASale();
        aSale.saleId = id;
        this.saleService.fetchASaleAsync(aSale)
            .then(()=> {
                this.aSale = aSale;
                this.saleService.activeSale = aSale.sale;
                this.checkSaleClosed();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    private checkSaleClosed() {
        if (this.aSale.sale == null) {
            this.saleClosed = false;
        } else {
            if (this.aSale.sale.closed) {
                this.saleClosed = true;
                this.payStep = true;
            } else {
                this.saleClosed = false;
            }
        }
    }



    onSaleInvalidated() {
        this.saleService.removeASaleAsync(this.aSale)
            .then(()=> {
                this.aSale = null;
                this.saleService.activeSale = null;
                return this.saleService.createASale();
            }).then((aSale:ASale)=> {
                this.aSale = aSale;
                this.navigatingWithinSale = true;
                this.router.navigate('/sales/new');
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onItemClicked(item:Item, commandView:CommandView, itemList:ItemListView) {
        itemList.focus();

        // Open sale if required
        if (this.aSale.sale == null) {
            this.saleService
                .openASaleAsync(this.aSale)
                .then((aSale)=> {
                    return this.saleService
                        .addItemToASaleAsync(aSale, item);
                }).then((aSale:ASale)=>{
                    var activeSaleId = aSale.saleId;
                    this.navigatingWithinSale = true;
                    this.router.navigate('/sales/sale/' + activeSaleId);
                }).catch((error)=> {
                    this.errorService.handleRequestError(error);
                });
            return;
        }

        return this.saleService.addItemToASaleAsync(this.aSale, item)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    onCommandValidated(validated:boolean, payView:PayView) {
        this.payStep = validated;
        payView.start();
    }

    onCommandPaid() {
        this.saleService.closeASaleAsync(this.aSale)
            .then(()=>{

            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });

        this.saleService.activeSale = null;
        this.payStep = false;

        this.router.navigate('/sales/new');
    }
}
