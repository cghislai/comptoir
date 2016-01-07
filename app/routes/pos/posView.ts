/**
 * Created by cghislai on 28/08/15.
 */

import {Component} from 'angular2/core';
import {RouteConfig,RouterOutlet,RouterLink, Location} from 'angular2/router';

import {AppHeader} from '../../components/app/header/appHeader';
import {AppTab} from '../../components/app/header/tab/appTab';


import {PosListView} from './list/listView';
import {EditPosView} from './edit/editView';

@Component({
    selector: 'pos-view',
    templateUrl: './routes/pos/posView.html',
    directives: [AppHeader, AppTab, RouterOutlet, RouterLink]
})
@RouteConfig([
    {path: '/edit/:id', component: EditPosView, as: 'Edit'},
    {path: '/list', component: PosListView, as: 'List', useAsDefault: true}
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
