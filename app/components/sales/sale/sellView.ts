/**
 * Created by cghislai on 29/07/15.
 */
import {Component, View, NgIf} from 'angular2/angular2';
import {Router, RouteParams, Location} from 'angular2/router';

import {CommandService, Command} from 'services/commandService';
import {Item} from 'services/itemService';
import {ItemList} from 'components/sales/sale/itemList/itemList';
import {CommandView} from 'components/sales/sale/commandView/commandView';
import {PayView} from 'components/sales/sale/payView/payView'

@Component({
    selector: "sellView",
})
@View({
    templateUrl: "./components/sales/sale/sellView.html",
    styleUrls: ["./components/sales/sale/sellView.css"],
    directives: [ItemList, CommandView, PayView, NgIf]
})


export class SellView {
    commandService:CommandService;
    commandValidated:boolean;
    command:Command;
    router:Router;
    location: Location;

    constructor(commandService:CommandService,
                router:Router, routeParams:RouteParams, location:Location) {
        this.commandService = commandService;
        this.commandValidated = false;
        this.router = router;
        this.location = location;

        var idValue = routeParams.get('id');
        this.findCommand(idValue);
    }


    findCommand(idValue:string) {
        if (idValue == 'new') {
            this.command = this.commandService.newCommand();
            return;
        }
        var idNumber = parseInt(idValue);
        if (isNaN(idNumber)) {
            if (this.commandService.activeCommand != null) {
                this.command = this.commandService.activeCommand;
                return;
            }
            this.command = this.commandService.newCommand();
            return;
        }
        this.command = this.commandService.getCommand(idNumber);
        if (this.command == undefined) {
            this.router.navigate('/sales/sale');
        }
        this.commandService.activeCommand = this.command;
    }

    onItemClicked(item:Item, commandView:CommandView, itemList:ItemList) {
        commandView.doAddItem(item);
        itemList.focus();
        if (this.command.id == null) {
            this.command.active = true;
            this.commandService.saveCommand(this.command);
            this.router.navigate('/sales/sale/'+this.command.id);
        }
    }

    onCommandValidated(validated:boolean, payView:PayView) {
        if (validated) {
            this.commandService.saveCommand(this.command);
            payView.calcRemaining();
        }
        this.commandValidated = validated;
    }

    onCommandPaid() {
        this.command.active = false;
        this.command.paid = true;
        this.commandService.saveCommand(this.command);

        this.command = this.commandService.newCommand();
        this.commandValidated = false;
        this.commandService.activeCommand = null;
        // TODO navigate to new
        this.router.navigate('/sales/sale')
    }

}