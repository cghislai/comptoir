/**
 * Created by cghislai on 28/08/15.
 */
import {Component, View} from 'angular2/angular2';
import {AppMenu} from '../../app/header/menu/appMenu';
@Component({
    selector: 'appHeader',
    inputs: ['title', 'inactive']
})
@View({
    templateUrl: './components/app/header/appHeader.html',
    styleUrls: ['./components/app/header/appHeader.css'],
    directives: [AppMenu]
})
export class AppHeader {

    title:string;
    inactive: boolean;

}
