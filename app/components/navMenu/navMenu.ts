/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, EventEmitter} from 'angular2/angular2';
import {RouterLink, Router,  RouteConfig} from 'angular2/router';


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
    currentPath: string;
    pageName: string;
    login: boolean;

    constructor(router: Router) {
        var thisMenu = this;
        router.subscribe(function(path) {
            thisMenu.onNaviagated(path);
        })
    }

    onNaviagated(path: string) {
        this.currentPath = path;
        this.pageName = this.getPageName();
        this.login = this.isActive('/login');
    }

    switchMenuVisibility() {
        this.menuVisible = !this.menuVisible;
    }


    isActive(path:string) {
        if (this.currentPath == null) {
            return false;
        }
        return this.currentPath.indexOf(path) == 0;
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

    open() {
        this.menuVisible = true;
    }

    close() {
        this.menuVisible = false;
    }
}

