/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View} from 'angular2/angular2';
import {Router, RouteConfig,RouterOutlet,RouterLink, Location} from 'angular2/router';
import {SaleView} from 'routes/sales/sale/saleView';
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
    {path: '/', redirectTo: '/active'},
    {path: '/new', component: SaleView, as: 'newSale'},
    {path: '/active', component: SaleView, as: 'activeSale'},
    {path: '/sale/:id', component: SaleView, as: 'sale'}
])
export class SalesView {
    location:Location;

    constructor(location:Location) {
        this.location = location;
    }

    isSaleViewActive() {
        var path = this.location.path();
        return path.indexOf('/sale/') >= 0
            || path.indexOf('/new') >= 0;
    }
}
