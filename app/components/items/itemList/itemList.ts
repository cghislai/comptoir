/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf,
    EventEmitter, Attribute, ViewEncapsulation} from 'angular2/angular2';

import {Item, ItemSearch} from 'client/domain/item';
import {PicturedItem} from 'client/utils/picture';
import {LocaleTexts} from 'client/utils/lang';

import {ApplicationService} from 'services/application';

import {AutoFocusDirective} from 'directives/autoFocus';
import {FocusableDirective} from 'directives/focusable';


/****
 * Column component
 */
@Component({
    selector: "itemColumn",
    properties: ['picItem: item', 'column', 'lang'],
    events: ['action']
})
@View({
    templateUrl: './components/items/itemList/itemColumn.html',
    styleUrls: ['./components/items/itemList/itemList.css'],
    directives: [NgIf, FocusableDirective],
    // eases styling
    encapsulation: ViewEncapsulation.NONE
})
export class ItemColumnComponent {
    action = new EventEmitter();

    onColumnAction(item:PicturedItem, column:ItemColumn, event) {
        this.action.next({item: item, column: column});
        //  event.stopPropagation();
    }

}


/*****
 * List component
 */

@Component({
    selector: 'itemList',
    properties: ['items', 'columns', 'selectable', 'headersParams: headers'],
    events: ['itemClicked', 'columnAction']
})

@View({
    templateUrl: './components/items/itemList/itemList.html',
    styleUrls: ['./components/items/itemList/itemList.css'],
    directives: [NgFor, NgIf, AutoFocusDirective, FocusableDirective, ItemColumnComponent]
})

export class ItemList {
    // properties
    items:PicturedItem[];
    columns:ItemColumn[];
    selectable:boolean;
    headers:boolean;

    itemClicked = new EventEmitter();
    columnAction = new EventEmitter();
    language:string;

    constructor(applicationService:ApplicationService,
                @Attribute('selectable') selectable) {
        this.language = applicationService.language.locale;

        if (selectable != undefined) {
            this.selectable = selectable != 'false';
        } else {
            this.selectable = true;
        }
    }

    set headersParams(value: string) {
        this.headers = value != 'false';
    }

    onItemClick(item:Item, col:ItemColumn) {
        if (col == ItemColumn.ACTION_REMOVE) {
            return;
        }
        this.itemClicked.next(item);
    }

    onColumnAction(event:any) {
        this.columnAction.next(event);
    }

}

export class ItemColumn {

    static REFERENCE:ItemColumn;
    static NAME:ItemColumn;
    static MODEL:ItemColumn;
    static DESCRIPTION:ItemColumn;
    static NAME_MODEL:ItemColumn;
    static TVA_EXCLUSIVE:ItemColumn;
    static TVA_RATE:ItemColumn;
    static PICTURE:ItemColumn;
    static ACTION_REMOVE:ItemColumn;
    static ALL_COLUMNS:ItemColumn[];

    title:LocaleTexts;
    name:string;
    alignRight:boolean;
    alignCenter:boolean;

    static init() {
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

        ItemColumn.MODEL = new ItemColumn();
        ItemColumn.MODEL.name = 'model';
        ItemColumn.MODEL.title = {
            'fr': "Modèle"
        };

        ItemColumn.DESCRIPTION = new ItemColumn();
        ItemColumn.DESCRIPTION.name = 'description';
        ItemColumn.DESCRIPTION.title = {
            'fr': "Description"
        };

        ItemColumn.NAME_MODEL = new ItemColumn();
        ItemColumn.NAME_MODEL.name = 'name_model';
        ItemColumn.NAME_MODEL.title = {
            'fr': "Nom / Modèle"
        };

        ItemColumn.TVA_EXCLUSIVE = new ItemColumn();
        ItemColumn.TVA_EXCLUSIVE.name = 'tva_excl';
        ItemColumn.TVA_EXCLUSIVE.alignRight = true;
        ItemColumn.TVA_EXCLUSIVE.title = {
            'fr': "Prix HTVA"
        };

        ItemColumn.TVA_RATE = new ItemColumn();
        ItemColumn.TVA_RATE.name = 'tva_rate';
        ItemColumn.TVA_RATE.alignRight = true;
        ItemColumn.TVA_RATE.title = {
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
