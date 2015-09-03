/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View} from 'angular2/angular2';
import {Router, RouteConfig,RouterOutlet,RouterLink, Location} from 'angular2/router';

import {AppHeader} from 'components/app/header/appHeader';
import {AppTab} from 'components/app/header/tab/appTab';


import {CountCashView} from 'routes/cash/count/countView';
import {CashHistoryView} from 'routes/cash/history/historyView';

@Component({
    selector: 'cashView'
})
@View({
    templateUrl: './routes/cash/cashView.html',
    directives: [AppHeader, AppTab, RouterOutlet, RouterLink]
})
@RouteConfig([
    {path: '/', redirectTo: '/items/list'},
    {path: '/count', component: CountCashView, as: 'count'},
    {path: '/history', component: CashHistoryView, as: 'history'}
])
export class CashView {
    location:Location;

    constructor(location:Location) {
        this.location = location;
    }

    isActive(path: string) {
        var fullPath = path.replace('./', 'cash/');
        var locationPath = this.location.path();
        return locationPath.indexOf(fullPath) >= 0;
    }
}
