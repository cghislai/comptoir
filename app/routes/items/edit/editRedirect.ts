/**
 * Created by cghislai on 04/09/15.
 */
import {Component, View} from 'angular2/angular2';
import {Router, RouteConfig, RouterOutlet} from 'angular2/router';

import {ItemEditView} from 'routes/items/edit/editView';
import {ItemVariantEditView} from 'routes/items/edit/editVariant/editVariantView';


@Component({
    selector: 'editItemRedirect'
})
@View({
    template: '<router-outlet></router-outlet>',
    directives: [RouterOutlet]
})
@RouteConfig([
    {path: '/', redirectTo: '/new'},
    {path: '/:itemId', component: ItemEditView, as:'edit'},
    {path: '/:itemId/variant/:variantId', component: ItemVariantEditView, as:'editVariant'}
])
export class EditItemRedirect {

}