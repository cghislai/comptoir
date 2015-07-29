/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgIf} from 'angular2/angular2';

import {ApplicationService} from 'services/applicationService';
import {CommandService} from 'services/commandService';
import {Item} from 'services/itemService';
import {ItemList} from 'components/itemList/itemList';
import {CommandView} from 'components/commandView/commandView';
import {PayView} from 'components/payView/payView'

@Component({
    selector: "sellView",
    viewInjector: [CommandService]
})
@View({
    templateUrl: "./components/sellView/sellView.html",
    styleUrls: ["./components/sellView/sellView.css"],
    directives: [ItemList, CommandView, PayView, NgIf]
})

export class SellView {
    commandService: CommandService;
    commandValidated: boolean;

    constructor(appService: ApplicationService, commandService: CommandService) {
        appService.pageName = "Vente";
        this.commandService = commandService;
        this.commandValidated = false;
    }

    onCommandValidated(validated: boolean) {
        this.commandValidated = validated;
    }
    onCommandPaid(event, view) {
        this.commandService.reset();
        this.commandValidated = false;
    }

}