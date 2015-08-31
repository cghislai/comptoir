/**
 * Created by cghislai on 28/08/15.
 */
import {Component, View,  bootstrap, NgIf, ViewEncapsulation} from 'angular2/angular2';

@Component({
    selector: 'appTab',
    properties: ['active', 'selectable']
})
@View({
    templateUrl: './components/app/header/tab/appTab.html',
    styleUrls: ['./components/app/header/tab/appTab.css'],
    encapsulation: ViewEncapsulation.NONE
})
export class AppTab {
    active: boolean;
    selectable: boolean;
}
