/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
import {Component, View} from 'angular2/angular2';
import {RouterLink, Location} from 'angular2/router';


@Component({
    selector: "navMenu"
})
@View({
    templateUrl: "./components/navMenu/navMenu.html",
    styleUrls: ["./components/navMenu/navMenu.css"],
    directives: [RouterLink]
})

export class NavMenu {
    menuVisible: boolean;
    location: Location;

    constructor(location: Location) {
        this.location = location;
    }
    switchMenuVisibility() {
        this.menuVisible = !this.menuVisible;
    }

    isActive(path: string) {
        return this.location.path().indexOf(path) == 0;
    }
    open() {
        this.menuVisible = true;
    }
    close() {
        this.menuVisible = false;
    }
}
