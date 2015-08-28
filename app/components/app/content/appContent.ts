/**
 * Created by cghislai on 28/08/15.
 */
import {Component, View,  bootstrap, NgIf} from 'angular2/angular2';

@Component({
    selector: 'appContent',
    properties: ['title']
})
@View({
    templateUrl: './components/app/content/appContent.html',
    styleUrls: ['./components/app/content/appContent.css']
})
export class AppContent {

    title:string;

    constructor() {

    }
}