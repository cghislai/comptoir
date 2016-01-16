/**
 * Created by cghislai on 05/08/15.
 */
import {Component} from 'angular2/core';
import {NgIf} from 'angular2/common';
import {RouteParams, Router, RouterLink, OnActivate} from 'angular2/router';

import {LocalItemVariant, LocalItemVariantFactory} from '../../../../client/localDomain/itemVariant';
import {LocalItem} from '../../../../client/localDomain/item';
import {Pricing} from '../../../../client/domain/itemVariant';

import {ItemService} from '../../../../services/item';
import {ItemVariantService} from '../../../../services/itemVariant';
import {ErrorService} from '../../../../services/error';
import {AuthService} from '../../../../services/auth';

import {ItemVariantEditComponent} from '../../../../components/itemVariant/edit/editVariant';

@Component({
    selector: 'editItemVariant',
    templateUrl: './routes/items/edit/editVariant/editVariantView.html',
    styleUrls: ['./routes/items/edit/editVariant/editVariantView.css'],
    directives: [NgIf, RouterLink, ItemVariantEditComponent]
})
export class ItemVariantEditView implements OnActivate {
    itemService:ItemService;
    itemVariantService:ItemVariantService;
    authService:AuthService;
    errorService:ErrorService;
    router:Router;
    routeParams:RouteParams;

    item:LocalItem;
    itemVariant:LocalItemVariant;

    constructor(itemVariantService:ItemVariantService, itemService:ItemService,
                authService:AuthService, errorService:ErrorService,
                routeParams:RouteParams, router:Router) {
        this.router = router;
        this.itemService = itemService;
        this.itemVariantService = itemVariantService;
        this.authService = authService;
        this.errorService = errorService;
        this.routeParams = routeParams;
    }

    routerOnActivate() {
        return this.findItem(this.routeParams)
            .then(()=> {
                this.findItemVariant(this.routeParams);
            });
    }

    findItem(routeParams:RouteParams):Promise<any> {
        if (routeParams == null || routeParams.params == null) {
            throw 'no route params';
        }
        var idParam = routeParams.get('itemId');
        var idNumber = parseInt(idParam);
        if (isNaN(idNumber)) {
            throw 'invalid item id param';
        }
        return this.getItem(idNumber);
    }

    getItem(id:number):Promise<any> {
        return this.itemService.get(id)
            .then((item)=> {
                this.item = item;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    findItemVariant(routeParams:RouteParams) {
        if (routeParams == null || routeParams.params == null) {
            this.getNewItemVariant();
            return;
        }
        var idParam = routeParams.get('variantId');
        var idNumber = parseInt(idParam);
        if (isNaN(idNumber)) {
            if (idParam === 'new') {
                this.getNewItemVariant();
                return;
            }
            this.getNewItemVariant();
            return;
        }
        this.getItemVariant(idNumber);
    }

    getNewItemVariant() {
        var itemVariantDesc:any = {};
        itemVariantDesc.attributeValues = [];
        itemVariantDesc.pricing = Pricing.PARENT_ITEM;
        itemVariantDesc.item = this.item;
        itemVariantDesc.pricingAmount = 0;
        itemVariantDesc.company = this.authService.getEmployeeCompany();
        this.itemVariant = LocalItemVariantFactory.createNewItemVariant(itemVariantDesc);
    }

    getItemVariant(id:number) {
        this.itemVariantService.get(id)
            .then((itemVariant:LocalItemVariant)=> {
                this.itemVariant = itemVariant;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onSaved(itemVariant) {
        var instruction = this.router.generate(['../EditItem', {itemId: itemVariant.item.id}]);
        this.router.navigateByInstruction(instruction);
    }

    onCancelled() {
        var instruction = this.router.generate(['../EditItem', {itemId: this.item.id}]);
        this.router.navigateByInstruction(instruction);
    }

}
