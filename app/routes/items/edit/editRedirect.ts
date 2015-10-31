/**
 * Created by cghislai on 04/09/15.
 */
import {Component, View} from 'angular2/angular2';
import {RouteConfig, RouterOutlet} from 'angular2/router';

import {ItemEditView} from './editView';
import {ItemVariantEditView} from './editVariant/editVariantView';


@Component({
    selector: 'editItemRedirect'
})
@View({
    template: '<router-outlet></router-outlet>',
    directives: [RouterOutlet]
})
@RouteConfig([
    {path: '/', redirectTo: '/new'},
    {path: '/:itemId', component: ItemEditView, as:'EditItem'},
    {path: '/:itemId/variant/:variantId', component: ItemVariantEditView, as:'EditVariant'}
])
export class EditItemRedirect {

}
