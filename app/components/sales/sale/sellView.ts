/**
 * Created by cghislai on 29/07/15.
 */
import {Component, View, NgIf} from 'angular2/angular2';
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
    directives: [ItemListView, CommandView, PayView, NgIf]
})
export class SellView {
    saleService:SaleService;
    posService:PosService;
    allPosList:Pos[];
    pos:Pos;

    aSale:ASale;
    payStep:boolean;

    router:Router;
    location:Location;
    language: string;

    constructor(saleService:SaleService, posService:PosService, appService: ApplicationService,
                router:Router, routeParams:RouteParams, location:Location) {
        this.saleService = saleService;
        this.posService = posService;
        this.router = router;
        this.location = location;
        this.language = appService.language.locale;

        this.searchPos();


        var idValue = routeParams.get('id');
        this.findSale(idValue);
    }

    searchPos() {
        var posSearch = new PosSearch();
        this.posService.searchPos(posSearch, null)
            .then((result:SearchResult<Pos>)=> {
                this.allPosList = result.list;
                var pos:Pos;
            });
    }


    findSale(idValue:string) {
        var idNumber = parseInt(idValue);
        if (this.aSale != null) {
            var saleExists = this.aSale.sale != null;
            if (!saleExists && idValue == 'new') {
                return;
            }
            if (saleExists) {
                if (this.aSale.sale.id == idNumber) {
                    return;
                }
            }
        }
        if (idValue == 'new') {
            this.aSale = new ASale();
            this.saleService.activeSale = null;
            return;
        }
        if (isNaN(idNumber)) {
            // prevent 'NPE'
            this.aSale = new ASale();
            if (this.saleService.activeSale != null) {
                var activeSale = this.saleService.activeSale;
                idNumber = activeSale.id;
                this.router.navigate('/sales/sale/' + idNumber);
                return;
            } else {
                this.saleService.activeSale = null;
                this.router.navigate('/sales/sale/new');
                return;
            }
        }
        this.getSale(idNumber);

    }

    getSale(idNumber:number) {
        this.aSale = new ASale();
        this.saleService.getASale(idNumber)
            .then((aSale)=> {
                this.aSale = aSale;
            });
    }

    onItemClicked(item:Item, commandView:CommandView, itemList:ItemListView) {
        itemList.focus();


        // Open sale if required
        if (this.aSale.sale == null) {
            return this.saleService
                .openASale(this.aSale)
                .then(()=> {
                    return this.saleService
                        .addItemToASale(this.aSale, item);
                }).then(()=> {
                    var activeSaleId = this.aSale.sale.id;
                    this.router.navigate('/sales/sale/' + activeSaleId);
                });
        }

        return this.saleService.addItemToASale(this.aSale, item)
            .then((aSale)=> {
                this.aSale = aSale;
            });
    }


    onCommandValidated(validated:boolean, payView:PayView) {
        this.payStep = validated;
        if (validated) {
            payView.calcRemaining();
        }
    }

    onCommandPaid() {
        this.saleService.closeASale(this.aSale)
            .then((aSale)=> {
                this.saleService.activeSale = null;
                this.router.navigate('/sales/sale/new');
            });
    }

    getActiveSaleRef():SaleRef {
        var ref = new SaleRef();
        ref.id = this.aSale.sale.id;
        return ref;
    }
}