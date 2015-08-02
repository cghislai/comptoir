/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgIf,  ViewQuery, QueryList, ViewContainerRef} from 'angular2/angular2';

import {ApplicationService} from 'services/applicationService';
import {CommandService} from 'services/commandService';
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
    commandView:CommandView;
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

    onItemClicked(item:Item) {
        var commandView = this.commandViewQuery.first;
        commandView.doAddItem(item);
    }

    onCommandValidated(validated:boolean) {
        if (validated) {
            var payView = this.payViewQuery.first;
            payView.calcRemaining();
        }
        this.commandValidated = validated;
    }

    onCommandPaid(event, view) {
        this.commandService.reset();
        var commandView = this.commandViewQuery.first;
        commandView.doUnvalidate();
        this.commandValidated = false;
    }

}