/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View} from 'angular2/angular2';
import {Router, RouteConfig,RouterOutlet,RouterLink, Location} from 'angular2/router';

import {AppHeader} from 'components/app/header/appHeader';
import {AppTab} from 'components/app/header/tab/appTab';


import {ItemsListView} from 'routes/items/list/listView';
import {ItemsEdiView} from 'routes/items/edit/editView';
import {ItemsImportView} from 'routes/items/import/importView';
@Component({
    selector: 'itemsView'
})
@View({
    templateUrl: './routes/items/itemsView.html',
    directives: [AppHeader, AppTab, RouterOutlet, RouterLink]
})
@RouteConfig([
    {path: '/', redirectTo: '/items/list'},
    {path: '/edit/:id', component: ItemsEdiView, as: 'edit'},
    {path: '/list', component: ItemsListView, as: 'list'},
    {path: '/import', component: ItemsImportView, as: 'import'}
])
export class ItemsView {
    location:Location;

    constructor(location:Location) {
        this.location = location;
    }

    isActive(path: string) {
        var fullPath = path.replace('./', 'items/');
        var locationPath = this.location.path();
        return locationPath.indexOf(fullPath) >= 0;
    }
}
