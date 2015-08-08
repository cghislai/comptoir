/**
 * Created by cghislai on 29/07/15.
 */
import {Component, View, NgIf} from 'angular2/angular2';
import {Router, RouteParams, Location} from 'angular2/router';

import {SaleService, Command} from 'services/saleService';
import {Item} from 'client/domain/item';
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
    commandValidated:boolean;
    command:Command;
    router:Router;
    location: Location;

    constructor(saleService :SaleService,
                router:Router, routeParams:RouteParams, location:Location) {
        this.saleService = saleService;
        this.commandValidated = false;
        this.router = router;
        this.location = location;

        var idValue = routeParams.get('id');
        this.findCommand(idValue);
    }


    findCommand(idValue:string) {
        if (idValue == 'new') {
            this.command = this.saleService.newCommand();
            return;
        }
        var idNumber = parseInt(idValue);
        if (isNaN(idNumber)) {
            if (this.saleService.activeCommand != null) {
                this.command = this.saleService.activeCommand;
                return;
            }
            this.command = this.saleService.newCommand();
            return;
        }
        this.command = this.saleService.getCommand(idNumber);
        if (this.command == undefined) {
            this.router.navigate('/sales/sale');
        }
        this.saleService.activeCommand = this.command;
    }

    onItemClicked(item:Item, commandView:CommandView, itemList:ItemListView) {
        commandView.doAddItem(item);
        itemList.focus();
        if (this.command.id == null) {
            this.command.active = true;
            this.saleService.saveCommand(this.command);
            this.router.navigate('/sales/sale/'+this.command.id);
        }
    }

    onCommandValidated(validated:boolean, payView:PayView) {
        if (validated) {
            this.saleService.saveCommand(this.command);
            payView.calcRemaining();
        }
        this.commandValidated = validated;
    }

    onCommandPaid() {
        this.command.active = false;
        this.command.paid = true;
        this.saleService.saveCommand(this.command);

        this.command = this.saleService.newCommand();
        this.commandValidated = false;
        this.saleService.activeCommand = null;
        // TODO navigate to new
        this.router.navigate('/sales/sale')
    }

}