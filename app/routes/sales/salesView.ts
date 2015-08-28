/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View} from 'angular2/angular2';
import {Router, RouteConfig,RouterOutlet} from 'angular2/router';
import {SaleView} from 'routes/sales/sale/saleView';
import {AppHeader} from 'components/app/header/appHeader';
import {AppMenu} from 'components/app/header/menu/appMenu';

@Component({
    selector: 'salesView'
})
@View({
    templateUrl: './routes/sales/salesView.html',
    directives: [AppHeader, AppMenu, RouterOutlet]
})
@RouteConfig([
    {path: '/sale', redirectTo: '/sale/active'},
    {path: '/sale/:id', component: SaleView, as:'sale'}
])
export class SalesView {
    constructor() {
        console.log("con");
    }
}
