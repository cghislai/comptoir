/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgIf, ViewQuery, Query, QueryList} from 'angular2/angular2';

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
    commandView: CommandView;
    query: QueryList<CommandView>;

    constructor(@Query(CommandView, {descendants: true}) query: QueryList<CommandView>,
                appService: ApplicationService, commandService: CommandService) {
        appService.pageName = "Vente";
        this.commandService = commandService;
        this.commandValidated = false;
        this.query = query;
    }
    onItemClicked(item: Item) {
        var commandView = this.query.first;
        commandView.doAddItem(item);
    }

    onCommandValidated(validated: boolean) {
        this.commandValidated = validated;
    }
    onCommandPaid(event, view) {
        this.commandService.reset();
        this.commandValidated = false;
    }

}