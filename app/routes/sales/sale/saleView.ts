/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View, NgIf, NgFor} from 'angular2/angular2';
import {Router, RouteParams, Location} from 'angular2/router';

import {Sale, SaleRef} from 'client/domain/sale';
import {Item, ItemRef} from 'client/domain/item';
import {ItemSale, ItemSaleSearch} from 'client/domain/itemSale';
import {Pos, PosRef, PosSearch} from 'client/domain/pos';

import {LocaleTexts} from 'client/utils/lang';
import {SearchResult} from 'client/utils/search';
import {ASale, ASaleItem} from 'client/utils/aSale';

import {ApplicationService} from 'services/application';
import {SaleService} from 'services/sale';
import {PosService} from 'services/pos';

import {ItemListView} from 'components/sales/sale/itemList/listView';
import {CommandView} from 'components/sales/sale/commandView/commandView';
import {PayView} from 'components/sales/sale/payView/payView'

@Component({
    selector: 'saleView'
})
@View({
    templateUrl: './routes/sales/sale/saleView.html',
    styleUrls: ['./routes/sales/sale/saleView.css'],
    directives: [ItemListView, CommandView, PayView, NgIf, NgFor]
})

export class SaleView {
    saleService:SaleService;
    posService:PosService;
    appService:ApplicationService;

    routeParams:RouteParams;
    router:Router;
    location: Location;

    aSale:ASale;
    payStep:boolean;
    saleClosed:boolean;
    navigatingWithinSale: boolean;

    allPosList:Pos[];
    pos:Pos;
    posId:number;

    language:string;

    constructor(saleService:SaleService, posService:PosService, appService:ApplicationService,
                routeParams:RouteParams, router: Router, location: Location) {
        this.saleService = saleService;
        this.posService = posService;
        this.appService = appService;

        this.routeParams = routeParams;
        this.router = router;
        this.location = location;
        this.language = appService.language.locale;
    }

    onActivate() {
        this.findSale();
        this.searchPos();
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
                this.appService.handleRequestError(error);
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


    searchPos() {
        var lastUsedPos = this.posService.lastUsedPos;
        if (lastUsedPos != null) {
            this.pos = lastUsedPos;
            this.posId = lastUsedPos.id;
            return;
        }
        var posSearch = new PosSearch();
        this.posService.searchPos(posSearch, null)
            .then((result:SearchResult<Pos>)=> {
                this.allPosList = result.list;
                if (result.list.length > 0 && this.pos == null) {
                    this.pos = result.list[0];
                    this.posId = this.pos.id;
                }
            }).catch((error)=> {
                this.appService.handleRequestError(error);
            });
    }

    onPosChanged(event) {
        this.pos = null;
        this.posId = event.target.value;
        for (var posItem of this.allPosList) {
            if (posItem.id == this.posId) {
                this.pos = posItem;
                break;
            }
        }
        this.posService.lastUsedPos = this.pos;
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
                this.appService.handleRequestError(error);
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
                    this.appService.handleRequestError(error);
                });
            return;
        }

        return this.saleService.addItemToASaleAsync(this.aSale, item)
            .catch((error)=> {
                this.appService.handleRequestError(error);
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
                this.appService.handleRequestError(error);
            });

        this.saleService.activeSale = null;
        this.payStep = false;

        this.router.navigate('/sales/new');
    }
}
