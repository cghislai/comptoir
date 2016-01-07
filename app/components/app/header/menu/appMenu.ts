/**
 * Created by cghislai on 28/08/15.
 */
import {Component} from 'angular2/core';
import {RouterLink} from 'angular2/router';

@Component({
    selector: 'app-menu',
    inputs: ['title', 'inactive'],
    templateUrl: './components/app/header/menu/appMenu.html',
    styleUrls: ['./components/app/header/menu/appMenu.css'],
    directives: [RouterLink]
})
export class AppMenu {
    title:string;
    inactive:boolean;
    menuVisible:boolean;

    closeMenuListener;

    constructor() {
        this.closeMenuListener = (event) => {
            if (this.menuVisible) {
                this.closeMenu();
                event.preventDefault();
                event.stopPropagation();
            }
        };
    }

    openCloseMenu(event) {
        if (this.menuVisible) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
        if (event != null) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    openMenu() {
        this.menuVisible = true;
        document.addEventListener('click', this.closeMenuListener);
    }

    closeMenu() {
        this.menuVisible = false;
        document.removeEventListener('click', this.closeMenuListener);
    }

    isActive(path:string) {
        //var locationPath = this.location.path();
        //return locationPath.indexOf(path) === 0;
        return false; // FIXME
    }
}
