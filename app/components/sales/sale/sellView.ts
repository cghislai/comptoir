/**
 * Created by cghislai on 29/07/15.
 */
import {Component, View, NgIf, NgFor, Query,QueryList} from 'angular2/angular2';
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
    selector: "sellView",
})
@View({
    templateUrl: "./components/sales/sale/sellView.html",
    styleUrls: ["./components/sales/sale/sellView.css"],
    directives: [ItemListView, CommandView, PayView, NgIf, NgFor]
})
export class SellView {
    saleService:SaleService;
    posService:PosService;
    appService:ApplicationService;
    allPosList:Pos[];
    pos:Pos;
    posId:number;

    aSale:ASale;
    payStep:boolean;
    saleClosed: boolean;

    router:Router;
    location:Location;
    language:string;
    routeParams:RouteParams;
    payView: PayView;

    constructor(saleService:SaleService, posService:PosService, appService:ApplicationService,
                router:Router, routeParams:RouteParams, location:Location) {
        this.saleService = saleService;
        this.posService = posService;
        this.appService = appService;
        this.router = router;
        this.location = location;

        this.language = appService.language.locale;


        var idValue = routeParams.get('id');

        this.searchPos();
        this.findSale(idValue);

        location.subscribe((val)=> {
            console.log(val);
        });
    }

    searchPos() {
        var posSearch = new PosSearch();
        var lastUsedPos = this.posService.lastUsedPos;
        if (lastUsedPos != null) {
            this.pos = lastUsedPos;
            this.posId = lastUsedPos.id;
        }
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


    // TODO: when passing custom data through route is accepted, navigate
    // using router.navigate and passing aSale
    findSale(idValue:string) {
        var idNumber = parseInt(idValue);
        if (this.aSale != null) {
            console.log("I got sale " + this.aSale.saleId + ' and asked for ' + idNumber);
            return;
        }
        if (idValue == 'new') {
            this.createSale();
            return;
        }
        if (isNaN(idNumber)) {
            var activeSale = this.saleService.activeSale;
            if (activeSale != null) {
                idNumber = activeSale.id;
                this.getSale(idNumber);
            } else {
                this.createSale();
            }
            return;
        }
        this.getSale(idNumber);
    }

    getSale(idNumber:number) {
        var aSale = this.saleService.createASale();
        aSale.saleId = idNumber;

        this.saleService.fetchASaleAsync(aSale)
            .then((aSale)=> {
                this.aSale = aSale;
                this.saleService.activeSale = aSale.sale;

                if (aSale.sale.closed) {
                    this.saleClosed = true;
                    this.payStep = true;
                } else {
                    this.saleClosed = false;
                }
            }).catch((error)=> {
                this.appService.handleRequestError(error);
            });
         //this.location.go('/sales/sale/'+idNumber);
        this.router.navigate('/sales/sale/'+idNumber);
    }

    createSale() {
        this.aSale = this.saleService.createASale();
        this.saleService.activeSale = null;
        this.saleClosed = false;
        this.router.navigate('/sales/sale/new');
    }

    onSaleInvalidated() {
        this.saleService.removeASaleAsync(this.aSale)
            .then(()=> {
                this.aSale = null;
                this.saleService.activeSale = null;
                return this.saleService.createASale();
            }).then((aSale:ASale)=> {
                this.aSale = aSale;
                this.location.go('/sales/sale/new');
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
                    var activeSaleId = aSale.saleId;
                    this.location.go('/sales/sale/' + activeSaleId);
                    return this.saleService
                        .addItemToASaleAsync(aSale, item);
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

        this.createSale();
        this.router.navigate('/sales/sale/new');
    }

    getActiveSaleRef():SaleRef {
        var ref = new SaleRef();
        ref.id = this.aSale.sale.id;
        return ref;
    }
}