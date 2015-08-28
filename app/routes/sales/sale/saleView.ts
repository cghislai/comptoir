/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View} from 'angular2/angular2';
import {Router, RouteParams} from 'angular2/router';

@Component({
    selector: 'saleView'
})
@View({
    templateUrl:'./routes/sales/sale/saleView.html',
    styleUrls: ['./routes/sales/sale/saleView.css']
})

export class SaleView {

    constructor(routeParams: RouteParams) {

    }
}
