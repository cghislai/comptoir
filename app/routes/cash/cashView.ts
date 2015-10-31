/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View} from 'angular2/angular2';
import {RouteConfig,RouterOutlet,RouterLink, Location} from 'angular2/router';

import {AppHeader} from '../../components/app/header/appHeader';
import {AppTab} from '../../components/app/header/tab/appTab';


import {CountCashView} from './count/countView';
import {CashHistoryView} from './history/historyView';

@Component({
    selector: 'cashView'
})
@View({
    templateUrl: './routes/cash/cashView.html',
    directives: [AppHeader, AppTab, RouterOutlet, RouterLink]
})
@RouteConfig([
    {path: '/', redirectTo: '/Count'},
    {path: '/count', component: CountCashView, as: 'Count'},
    {path: '/history', component: CashHistoryView, as: 'History'}
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
