/**
 * Created by cghislai on 28/08/15.
 */
import {Component, View} from 'angular2/angular2';
import {RouterLink, Location} from 'angular2/router';

@Component({
    selector: 'appMenu',
    inputs: ['title', 'inactive']
})
@View({
    templateUrl: './components/app/header/menu/appMenu.html',
    styleUrls: ['./components/app/header/menu/appMenu.css'],
    directives: [RouterLink]
})
export class AppMenu {
    location:Location;
    title:string;
    inactive:boolean;
    menuVisible:boolean;

    closeMenuListener;

    constructor(location:Location) {
        this.location = location;
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
        var locationPath = this.location.path();
        return locationPath.indexOf(path) === 0;
    }
}
