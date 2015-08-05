/**
 * Created by cghislai on 05/08/15.
 */

import {Component, View} from 'angular2/angular2';
import {RouterOutlet, RouteConfig} from 'angular2/router'
import {Child} from 'components/test/child';

@Component({
    selector: 'parent'
})
@View({
    template: `
        <div>Parent</div>
        <div>
            parent content:
            <ng-content></ng-content>
        </div>
        <div>
            parent outlet:
            <router-outlet></router-outlet>
        </div>`,
    directives: [RouterOutlet]
})
@RouteConfig([
    {path: '/...', component: Parent, as:'root'},
    {path: '/child', component: Child, as:'child'}
])
export class Parent {

}
