/**
 * Created by cghislai on 28/08/15.
 */
import {Component, View,  bootstrap, NgIf} from 'angular2/angular2';

@Component({
    selector: 'appMenu',
    properties: ['title', 'inactive']
})
@View({
    templateUrl: './components/app/header/menu/appMenu.html',
    styleUrls: ['./components/app/header/menu/appMenu.css']
})
export class AppMenu {

    title:string;
    inactive:boolean;
    menuVisible:boolean;

    constructor() {

    }

    openCloseMenu() {
        if (this.menuVisible) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.menuVisible = true;
    }

    closeMenu() {
        this.menuVisible = false;
    }
}