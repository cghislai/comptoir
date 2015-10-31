/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View} from 'angular2/angular2';
import {Router, RouteConfig,RouterOutlet,RouterLink, Location} from 'angular2/router';

import {AppHeader} from '../../components/app/header/appHeader';
import {AppMenu} from '../../components/app/header/menu/appMenu';
import {AppTab} from '../../components/app/header/tab/appTab';

import {AccountsListView} from './list/listView';
import {AccountsEditView} from './edit/editView';

@Component({
    selector: 'accountsView'
})
@View({
    templateUrl: './routes/accounts/accountsView.html',
    directives: [AppHeader, AppMenu, AppTab, RouterOutlet, RouterLink]
})
@RouteConfig([
    {path: '/', redirectTo: '/List'},
    {path: '/edit/:id', component: AccountsEditView, as: 'Edit'},
    {path: '/list', component: AccountsListView, as: 'List'}
])
export class AccountsView {
    location:Location;

    constructor(location:Location) {
        this.location = location;
    }

    isActive(path: string) {
        var fullPath = path.replace('./', 'accounts/');
        var locationPath = this.location.path();
        return locationPath.indexOf(fullPath) >= 0;
    }
}
