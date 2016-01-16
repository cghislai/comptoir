/**
 * Created by cghislai on 05/08/15.
 */
import {Component, ChangeDetectionStrategy} from 'angular2/core';
import {NgIf} from 'angular2/common';
import {RouteParams, Router, RouterLink, OnActivate} from 'angular2/router';

import {LocalItem, LocalItemFactory} from '../../../client/localDomain/item';

import {CompanyRef} from '../../../client/domain/company';
import {ItemRef, ItemSearch} from '../../../client/domain/item';
import {ItemVariantSearch} from '../../../client/domain/itemVariant';
import {Language, LocaleTextsFactory} from '../../../client/utils/lang';
import {NumberUtils} from '../../../client/utils/number';
import {SearchRequest, SearchResult} from '../../../client/utils/search';

import {ItemService} from '../../../services/item';
import {ErrorService} from '../../../services/error';
import {AuthService} from '../../../services/auth';

import {ItemEditComponent} from '../../../components/item/edit/editView';

import * as Immutable from 'immutable';


@Component({
    selector: 'edit-item',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './routes/items/edit/editView.html',
    styleUrls: ['./routes/items/edit/editView.css'],
    directives: [ItemEditComponent, NgIf, RouterLink]
})
export class ItemEditView implements OnActivate {
    itemService:ItemService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;
    routeParams:RouteParams;

    item:LocalItem;


    constructor(itemService:ItemService, errorService:ErrorService,
                authService:AuthService,
                routeParams:RouteParams, router:Router) {
        this.router = router;
        this.itemService = itemService;
        this.errorService = errorService;
        this.authService = authService;
        this.routeParams = routeParams;
    }

    routerOnActivate() {
        this.findItem(this.routeParams);
    }

    findItem(routeParams:RouteParams) {
        if (routeParams == null || routeParams.params == null) {
            this.getNewItem();
            return;
        }
        var idParam = routeParams.get('itemId');
        var idNumber = parseInt(idParam);
        if (isNaN(idNumber)) {
            if (idParam === 'new') {
                this.getNewItem();
                return;
            }
            this.getNewItem();
            return;
        }
        this.getItem(idNumber);
    }

    getNewItem() {
        var itemDesc:any = {};
        itemDesc.description = LocaleTextsFactory.toLocaleTexts({});
        itemDesc.name = LocaleTextsFactory.toLocaleTexts({});
        itemDesc.company = this.authService.getEmployeeCompany();
        this.item = LocalItemFactory.createNewItem(itemDesc);
    }

    getItem(id:number) {
        this.itemService.get(id)
            .then((item:LocalItem)=> {
                this.item = item;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onSaved(item) {
        this.router.navigate(['/Items/List']);
    }

    onCancelled() {
        this.router.navigate(['/Items/List']);
    }

}

