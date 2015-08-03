/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
import {Component, View} from 'angular2/angular2';

import {ApplicationService} from 'services/applicationService';
import {CommandService, Command} from 'services/commandService';
import {Item} from 'services/itemService';
import {ItemList} from 'components/sell/itemList/itemList';
import {CommandView} from 'components/sell/commandView/commandView';
import {PayView} from 'components/sell/payView/payView'

@Component({
    selector: "sellView",
})
@View({
    templateUrl: "./components/sell/sellView.html",
    styleUrls: ["./components/sell/sellView.css"],
    directives: [ItemList, CommandView, PayView]
})

export class SellView {
    commandService:CommandService;
    commandValidated:boolean;

    constructor(appService:ApplicationService, commandService:CommandService) {
        appService.pageName = "Vente";
        this.commandService = commandService;
        this.commandValidated = false;
    }

    onItemClicked(item:Item, commandView: CommandView) {
        commandView.doAddItem(item);
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