/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf,
    EventEmitter, Attribute, ViewEncapsulation} from 'angular2/angular2';

import {LocalItem} from 'client/localDomain/item';
import {LocalPicture} from 'client/localDomain/picture';

import {LocaleTexts} from 'client/utils/lang';

import {AuthService} from 'services/auth';

import {AutoFocusDirective} from 'components/utils/autoFocus';
import {FocusableDirective} from 'components/utils/focusable';


/****
 * Column component
 */
@Component({
    selector: "itemColumn",
    properties: ['item', 'column', 'lang'],
    events: ['action']
})
@View({
    templateUrl: './components/item/list/itemColumn.html',
    styleUrls: ['./components/item/list/itemList.css'],
    directives: [NgIf, FocusableDirective],
    // eases styling
    encapsulation: ViewEncapsulation.None
})
export class ItemColumnComponent {
    action = new EventEmitter();
    item:LocalItem;
    column:ItemColumn;
    lang:string;

    onColumnAction(item:LocalItem, column:ItemColumn, event) {
        this.action.next({item: item, column: column});
        event.stopPropagation();
        event.preventDefault();
    }

}


/*****
 * List component
 */

@Component({
    selector: 'itemList',
    properties: ['items', 'columns', 'rowSelectable', 'headersVisible'],
    events: ['rowClicked', 'columnAction']
})

@View({
    templateUrl: './components/item/list/itemList.html',
    styleUrls: ['./components/item/list/itemList.css'],
    directives: [NgFor, NgIf, AutoFocusDirective, FocusableDirective, ItemColumnComponent]
})

export class ItemList {
    // properties
    items:LocalItem[];
    columns:ItemColumn[];
    itemSelectable:boolean;
    headersVisible:boolean;

    rowClicked = new EventEmitter();
    columnAction = new EventEmitter();
    locale:string;

    constructor(authService:AuthService) {
        this.locale = authService.getEmployeeLanguage().locale;
    }


    onItemClick(item:LocalItem, event) {
        this.rowClicked.next(item);
        event.stopPropagation();
        event.preventDefault();
    }

    onColumnAction(event:any) {
        this.columnAction.next(event);
    }

}

export class ItemColumn {

    static ID:ItemColumn;
    static REFERENCE:ItemColumn;
    static NAME:ItemColumn;
    static DESCRIPTION:ItemColumn;
    static VAT_EXCLUSIVE:ItemColumn;
    static VAT_RATE:ItemColumn;
    static PICTURE:ItemColumn;
    static ACTION_REMOVE:ItemColumn;
    static ALL_COLUMNS:ItemColumn[];

    title:LocaleTexts;
    name:string;
    alignRight:boolean;
    alignCenter:boolean;

    static init() {
        ItemColumn.ID = new ItemColumn();
        ItemColumn.ID.name = 'id';
        ItemColumn.ID.title = {
            'fr': "Id"
        };

        ItemColumn.REFERENCE = new ItemColumn();
        ItemColumn.REFERENCE.name = 'ref';
        ItemColumn.REFERENCE.title = {
            'fr': "Ref"
        };

        ItemColumn.NAME = new ItemColumn();
        ItemColumn.NAME.name = 'name';
        ItemColumn.NAME.title = {
            'fr': "Nom"
        };

        ItemColumn.DESCRIPTION = new ItemColumn();
        ItemColumn.DESCRIPTION.name = 'description';
        ItemColumn.DESCRIPTION.title = {
            'fr': "Description"
        };

        ItemColumn.VAT_EXCLUSIVE = new ItemColumn();
        ItemColumn.VAT_EXCLUSIVE.name = 'tva_excl';
        ItemColumn.VAT_EXCLUSIVE.alignRight = true;
        ItemColumn.VAT_EXCLUSIVE.title = {
            'fr': "Prix HTVA"
        };

        ItemColumn.VAT_RATE = new ItemColumn();
        ItemColumn.VAT_RATE.name = 'tva_rate';
        ItemColumn.VAT_RATE.alignRight = true;
        ItemColumn.VAT_RATE.title = {
            'fr': "TVA%"
        };

        ItemColumn.PICTURE = new ItemColumn();
        ItemColumn.PICTURE.name = 'picture';
        ItemColumn.PICTURE.alignCenter = true;
        ItemColumn.PICTURE.title = {
            'fr': "Image"
        };

        ItemColumn.ACTION_REMOVE = new ItemColumn();
        ItemColumn.ACTION_REMOVE.name = 'action_remove';
        ItemColumn.ACTION_REMOVE.title = null;
    }
}

ItemColumn.init();
