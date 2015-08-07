/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, EventEmitter} from 'angular2/angular2';
import {RouterLink, RouteConfig, Location} from 'angular2/router';


@Component({
    selector: "navMenu"
})
@View({
    templateUrl: "./components/navMenu/navMenu.html",
    styleUrls: ["./components/navMenu/navMenu.css"],
    directives: [RouterLink]
})


export class NavMenu {
    menuVisible:boolean;
    location:Location;

    constructor(location:Location) {
        this.location = location;
    }

    switchMenuVisibility() {
        this.menuVisible = !this.menuVisible;
    }

    getPath() {
        return this.location.path();
    }

    isActive(path:string) {
        return this.location.path().indexOf(path) == 0;
    }

    getPageName() {
        if (this.isActive('/sale')) {
            return "Ventes";
        }
        if (this.isActive('/products')) {
            return "Produits";
        }
        if (this.isActive('/cash')) {
            return "Caisse";
        }
        if (this.isActive('/settings')) {
            return "Paramètres";
        }
        if (this.isActive('/accounts')) {
            return "Comptes";
        }
        if (this.isActive('/login')) {
            return "Connection";
        }
    }
    isLogin() {
        return this.isActive('/login');
    }
open() {
        this.menuVisible = true;
    }

    close() {
        this.menuVisible = false;
    }
}

