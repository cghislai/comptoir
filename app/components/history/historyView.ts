/**
 * Created by cghislai on 31/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, ViewQuery, Query, QueryList} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables, Location} from 'angular2/router';

import {ApplicationService} from 'services/applicationService';
import {HistoryCommandsView} from 'components/history/commands/historyCommandsView';

@Component({
    selector: "historyView"
})
@View({
    templateUrl: "./components/history/historyView.html",
    styleUrls: ["./components/history/historyView.css"],
    directives: [RouterOutlet, RouterLink]
})


@RouteConfig([
    {path: '', redirectTo: '/history/commands'},
    {path: '/commands', component: HistoryCommandsView, as: 'commands'}
])

export class HistoryView {
    location: Location;
    constructor(appService:ApplicationService, location: Location) {
        appService.pageName = "Historique";
        this.location = location;
    }
    isActive(path: string):boolean {
        return this.location.path().indexOf("/history"+path) == 0;
    }
}