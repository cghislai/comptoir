/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View} from 'angular2/angular2';
import {RouteConfig,RouterOutlet,RouterLink, Location} from 'angular2/router';

import {AppHeader} from '../../components/app/header/appHeader';
import {AppTab} from '../../components/app/header/tab/appTab';

import {EditItemRedirect} from './edit/editRedirect';
import {ItemsListView} from './list/listView';
import {ItemsImportView} from './import/importView';

@Component({
    selector: 'itemsView'
})
@View({
    templateUrl: './routes/items/itemsView.html',
    directives: [AppHeader, AppTab, RouterOutlet, RouterLink]
})
@RouteConfig([
    {path: '/', redirectTo: '/list'},
    {path: '/edit/...', component: EditItemRedirect, as: 'Edit'},
    {path: '/list', component: ItemsListView, as: 'List'},
    {path: '/import', component: ItemsImportView, as: 'Import'}
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
