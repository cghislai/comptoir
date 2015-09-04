/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf,
    EventEmitter, Attribute, ViewEncapsulation} from 'angular2/angular2';

import {LocalItemVariant} from 'client/localDomain/itemVariant';
import {LocalPicture} from 'client/localDomain/picture';

import {LocaleTexts} from 'client/utils/lang';

import {AuthService} from 'services/auth';

import {AutoFocusDirective} from 'directives/autoFocus';
import {FocusableDirective} from 'directives/focusable';


/****
 * Column component
 */
@Component({
    selector: "itemVariantColumn",
    properties: ['itemVariant', 'column', 'lang'],
    events: ['action']
})
@View({
    templateUrl: './components/items/itemVariantList/itemColumn.html',
    styleUrls: ['./components/items/itemVariantList/itemList.css'],
    directives: [NgIf, FocusableDirective],
    // eases styling
    encapsulation: ViewEncapsulation.NONE
})
export class ItemVariantColumnComponent {
    action = new EventEmitter();
    itemVariant: LocalItemVariant;
    column: ItemVariantColumn;
    lang: string;

    onColumnAction(item:LocalItemVariant, column:ItemVariantColumn, event) {
        this.action.next({itemVariant: item, column: column});
        event.stopPropagation();
        event.preventDefault();
        //  event.stopPropagation();
    }

}


/*****
 * List component
 */

@Component({
    selector: 'itemVariantList',
    properties: ['items', 'columns', 'rowSelectable', 'headersVisible'],
    events: ['rowClicked', 'columnAction']
})

@View({
    templateUrl: './components/items/itemVariantList/itemList.html',
    styleUrls: ['./components/items/itemVariantList/itemList.css'],
    directives: [NgFor, NgIf, AutoFocusDirective, FocusableDirective, ItemVariantColumnComponent]
})

export class ItemVariantList {
    // properties
    items:LocalItemVariant[];
    columns:ItemVariantColumn[];
    itemSelectable:boolean;
    headersVisible:boolean;

    rowClicked = new EventEmitter();
    columnAction = new EventEmitter();
    locale:string;

    constructor(authService: AuthService) {
        this.locale = authService.getEmployeeLanguage().locale;
    }


    onItemClick(item:LocalItemVariant, event) {
        this.rowClicked.next(item);
        event.stopPropagation();
        event.preventDefault();
    }

    onColumnAction(event:any) {
        this.columnAction.next(event);
    }

}

export class ItemVariantColumn {

    static REFERENCE:ItemVariantColumn;
    static NAME:ItemVariantColumn;
    static MODEL:ItemVariantColumn;
    static DESCRIPTION:ItemVariantColumn;
    static NAME_MODEL:ItemVariantColumn;
    static TVA_EXCLUSIVE:ItemVariantColumn;
    static TVA_RATE:ItemVariantColumn;
    static PICTURE:ItemVariantColumn;
    static ACTION_REMOVE:ItemVariantColumn;
    static ALL_COLUMNS:ItemVariantColumn[];

    title:LocaleTexts;
    name:string;
    alignRight:boolean;
    alignCenter:boolean;

    static init() {
        ItemVariantColumn.REFERENCE = new ItemVariantColumn();
        ItemVariantColumn.REFERENCE.name = 'ref';
        ItemVariantColumn.REFERENCE.title = {
            'fr': "Ref"
        };

        ItemVariantColumn.NAME = new ItemVariantColumn();
        ItemVariantColumn.NAME.name = 'name';
        ItemVariantColumn.NAME.title = {
            'fr': "Nom"
        };

        ItemVariantColumn.MODEL = new ItemVariantColumn();
        ItemVariantColumn.MODEL.name = 'model';
        ItemVariantColumn.MODEL.title = {
            'fr': "Modèle"
        };

        ItemVariantColumn.DESCRIPTION = new ItemVariantColumn();
        ItemVariantColumn.DESCRIPTION.name = 'description';
        ItemVariantColumn.DESCRIPTION.title = {
            'fr': "Description"
        };

        ItemVariantColumn.NAME_MODEL = new ItemVariantColumn();
        ItemVariantColumn.NAME_MODEL.name = 'name_model';
        ItemVariantColumn.NAME_MODEL.title = {
            'fr': "Nom / Modèle"
        };

        ItemVariantColumn.TVA_EXCLUSIVE = new ItemVariantColumn();
        ItemVariantColumn.TVA_EXCLUSIVE.name = 'tva_excl';
        ItemVariantColumn.TVA_EXCLUSIVE.alignRight = true;
        ItemVariantColumn.TVA_EXCLUSIVE.title = {
            'fr': "Prix HTVA"
        };

        ItemVariantColumn.TVA_RATE = new ItemVariantColumn();
        ItemVariantColumn.TVA_RATE.name = 'tva_rate';
        ItemVariantColumn.TVA_RATE.alignRight = true;
        ItemVariantColumn.TVA_RATE.title = {
            'fr': "TVA%"
        };

        ItemVariantColumn.PICTURE = new ItemVariantColumn();
        ItemVariantColumn.PICTURE.name = 'picture';
        ItemVariantColumn.PICTURE.alignCenter = true;
        ItemVariantColumn.PICTURE.title = {
            'fr': "Image"
        };

        ItemVariantColumn.ACTION_REMOVE = new ItemVariantColumn();
        ItemVariantColumn.ACTION_REMOVE.name = 'action_remove';
        ItemVariantColumn.ACTION_REMOVE.title = null;
    }
}

ItemVariantColumn.init();
