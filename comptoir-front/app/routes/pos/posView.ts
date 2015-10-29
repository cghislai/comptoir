/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View} from 'angular2/angular2';
import {Router, RouteConfig,RouterOutlet,RouterLink, Location} from 'angular2/router';

import {AppHeader} from 'components/app/header/appHeader';
import {AppTab} from 'components/app/header/tab/appTab';


import {PosListView} from 'routes/pos/list/listView';
import {EditPosView} from 'routes/pos/edit/editView';

@Component({
    selector: 'posView'
})
@View({
    templateUrl: './routes/pos/posView.html',
    directives: [AppHeader, AppTab, RouterOutlet, RouterLink]
})
@RouteConfig([
    {path: '/', redirectTo: '/list'},
    {path: '/edit/:id', component: EditPosView, as: 'Edit'},
    {path: '/list', component: PosListView, as: 'List'}
])
export class PosView {
    location:Location;

    constructor(location:Location) {
        this.location = location;
    }

    isActive(path: string) {
        var fullPath = path.replace('./', 'pos/');
        var locationPath = this.location.path();
        return locationPath.indexOf(fullPath) >= 0;
    }
}
