/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgIf,  ViewQuery, QueryList, ViewContainerRef} from 'angular2/angular2';

import {ApplicationService} from 'services/applicationService';
import {CommandService, Command} from 'services/commandService';
import {Item} from 'services/itemService';
import {ItemList} from 'components/sell/itemList/itemList';
import {CommandView} from 'components/sell/commandView/commandView';
import {PayView} from 'components/sell/payView/payView'

@Component({
    selector: "sellView",
    viewInjector: [CommandService]
})
@View({
    templateUrl: "./components/sell/sellView.html",
    styleUrls: ["./components/sell/sellView.css"],
    directives: [ItemList, CommandView, PayView, NgIf]
})

export class SellView {
    commandService:CommandService;
    commandValidated:boolean;
    commandViewQuery:QueryList<CommandView>;
    payViewQuery:QueryList<PayView>;

    constructor( @ViewQuery(CommandView, {descendants: true}) commandViewQuery:QueryList<CommandView>,
                @ViewQuery(PayView, {descendants: true}) payViewQuery:QueryList<PayView>,
                appService:ApplicationService, commandService:CommandService) {
        appService.pageName = "Vente";
        this.commandService = commandService;
        this.commandValidated = false;
        this.commandViewQuery = commandViewQuery;
        this.payViewQuery = payViewQuery;

    }

    getCommandView():CommandView {
        return this.commandViewQuery.first;
    }
    getCommand():Command {
        var commandView = this.getCommandView();
        return commandView.command;
    }
    onItemClicked(item:Item) {
        var commandView = this.getCommandView();
        commandView.doAddItem(item);
    }

    onCommandValidated(validated:boolean) {
        if (validated) {
            var payView = this.payViewQuery.first;
            var command = this.getCommand();
            payView.payCommand(command);
        }
        this.commandValidated = validated;
    }

    onCommandPaid(event, view) {
        var commandView = this.getCommandView();
        commandView.onCommandPaid()
        this.commandValidated = false;
    }

}