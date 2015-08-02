/**
 * Created by cghislai on 31/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, ViewQuery, Query, QueryList} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables, Location} from 'angular2/router';

import {ApplicationService} from 'services/applicationService';
import {EditItemsView} from 'components/edit/editItemsView/editItemsView';
import {EditCashView} from 'components/edit/editCash/editCashView';

@Component({
    selector: "editView"
})
@View({
    templateUrl: "./components/edit/editView.html",
    styleUrls: ["./components/edit/editView.css"],
    directives: [RouterOutlet, RouterLink]
})


@RouteConfig([
    {path: '', redirectTo: '/edit/items'},
    {path: '/items', component: EditItemsView, as: 'items'},
    {path: '/cash', component: EditCashView, as: 'cash'}
])

export class EditView {
    location: Location;
    constructor(appService:ApplicationService, location: Location) {
        appService.pageName = "Édition";
        this.location = location;
    }
    isActive(path: string):boolean {
        return this.location.path().indexOf("/edit"+path) == 0;
    }
}