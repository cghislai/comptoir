/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View} from 'angular2/angular2';
import {Router, RouteConfig,RouterOutlet,RouterLink, Location} from 'angular2/router';

import {SaleView} from 'routes/sales/sale/saleView';
import {ActiveSalesView} from 'routes/sales/actives/listView';
import {SaleHistoryView} from 'routes/sales/history/historyView';

import {AppHeader} from 'components/app/header/appHeader';
import {AppMenu} from 'components/app/header/menu/appMenu';
import {AppTab} from 'components/app/header/tab/appTab';

@Component({
    selector: 'salesView'
})
@View({
    templateUrl: './routes/sales/salesView.html',
    directives: [AppHeader, AppMenu, AppTab, RouterOutlet, RouterLink]
})
@RouteConfig([
    {path: '', redirectTo: 'Actives'},
    {path: '/sale/:id', component: SaleView, as: 'Sale'},
    {path: '/actives', component: ActiveSalesView, as: 'Actives'},
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

    canReuse() {
       return false;
    }
}
