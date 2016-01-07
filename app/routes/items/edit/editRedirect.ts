/**
 * Created by cghislai on 04/09/15.
 */
import {Component} from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';

import {ItemEditView} from './editView';
import {ItemVariantEditView} from './editVariant/editVariantView';


@Component({
    selector: 'editItemRedirect',
    template: '<router-outlet></router-outlet>',
    directives: [RouterOutlet]
})
@RouteConfig([
    {path: '/', redirectTo: ['./EditItem', {id: 'new'}]},
    {path: '/:itemId', component: ItemEditView, as:'EditItem'},
    {path: '/:itemId/variant/:variantId', component: ItemVariantEditView, as:'EditVariant'}
])
export class EditItemRedirect {

}
