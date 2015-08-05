/**
 * Created by cghislai on 29/07/15.
 */
import {Component, View} from 'angular2/angular2';

import {ApplicationService} from 'services/application';
import {CommandService, Command} from 'services/commandService';
import {Item} from 'services/itemService';
import {ItemList} from 'components/sale/current/itemList/itemList';
import {CommandView} from 'components/sale/current/commandView/commandView';
import {PayView} from 'components/sale/current/payView/payView'

@Component({
    selector: "sellView",
})
@View({
    templateUrl: "./components/sale/current/sellView.html",
    styleUrls: ["./components/sale/current/sellView.css"],
    directives: [ItemList, CommandView, PayView]
})


export class SellView {
    commandService:CommandService;
    commandValidated:boolean;

    constructor(appService:ApplicationService, commandService:CommandService) {
        this.commandService = commandService;
        this.commandValidated = false;
    }

    onItemClicked(item:Item, commandView: CommandView, itemList: ItemList) {
        commandView.doAddItem(item);
        itemList.focus();
    }

    onCommandValidated(validated:boolean, payView: PayView, commandView: CommandView) {
        if (validated) {
            var command = commandView.command;
            payView.payCommand(command);
        }
        this.commandValidated = validated;
    }

    onCommandPaid(commandView: CommandView) {
        commandView.onCommandPaid()
        this.commandValidated = false;
    }

}