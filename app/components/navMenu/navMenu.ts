/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
import {Component, View} from 'angular2/angular2';
import {RouterLink} from 'angular2/router';


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

    constructor() {
        this.menuVisible = false;
    }
    switchMenuVisibility() {
        this.menuVisible = !this.menuVisible;
    }
}
