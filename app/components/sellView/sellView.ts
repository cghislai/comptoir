/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
import {Component, View} from 'angular2/angular2';

import {ApplicationService} from 'services/applicationService';
import {CommandService} from 'services/commandService';
import {ItemList} from 'components/itemList/itemList';
import {CommandView} from 'components/commandView/commandView';

@Component({
    selector: "sellView",
    viewInjector: [CommandService]
})
@View({
    templateUrl: "./components/sellView/sellView.html",
    styleUrls: ["./components/sellView/sellView.css"],
    directives: [ItemList, CommandView]
})

export class SellView {

    constructor(appService: ApplicationService) {
        appService.pageName = "Vente";
    }
}