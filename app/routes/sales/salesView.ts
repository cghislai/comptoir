/**
 * Created by cghislai on 28/08/15.
 */

import {Component} from 'angular2/core';
import {RouteConfig,RouterOutlet,RouterLink, Location} from 'angular2/router';

import {SaleView} from './sale/saleView';
import {ActiveSalesView} from './actives/listView';
import {SaleHistoryView} from './history/historyView';

import {AppHeader} from '../../components/app/header/appHeader';
import {AppMenu} from '../../components/app/header/menu/appMenu';
import {AppTab} from '../../components/app/header/tab/appTab';

@Component({
    selector: 'sales-view',
    templateUrl: './routes/sales/salesView.html',
    directives: [AppHeader, AppMenu, AppTab, RouterOutlet, RouterLink]
})
@RouteConfig([
    {path: '/sale/:id', component: SaleView, as: 'Sale'},
    {path: '/actives', component: ActiveSalesView, as: 'Actives', useAsDefault: true},
    {path: '/history', component: SaleHistoryView, as: 'History'}
])
export class SalesView {
    location:Location;

    constructor(location:Location) {
        this.location = location;
    }

    isActive(path: string) {
        var fullPath = path.replace('./', 'sales/');
        var locationPath = this.location.path();
        return locationPath.indexOf(fullPath) >= 0;
    }

}
