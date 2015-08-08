/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, ElementRef,
    EventEmitter, Attribute, ViewEncapsulation} from 'angular2/angular2';

import {Item, ItemSearch} from 'client/domain/item';
import {PicturedItem} from 'client/utils/picture';
import {Pagination} from 'client/utils/pagination';
import {LocaleText, LocaleTextFactory} from 'client/domain/lang';

import {ApplicationService} from 'services/application';
import {ItemService} from 'services/itemService';
import {Locale} from 'services/utils';

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
    directives: [NgIf],
    encapsulation: ViewEncapsulation.NONE
})
export class ItemColumnComponent {
    action= new EventEmitter();

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
    properties: ['items', 'propColumns: columns', 'selectable', 'headers'],
    events: ['itemClicked', 'columnAction']
})

@View({
    templateUrl: './components/items/itemList/itemList.html',
    styleUrls: ['./components/items/itemList/itemList.css'],
    directives: [NgFor, NgIf, AutoFocusDirective, FocusableDirective, ItemColumnComponent]
})

export class ItemList {
    // properties
    propColumns:ItemColumn[];
    propSelectable:boolean;
    propHeaders:boolean;

    itemService:ItemService;
    items:PicturedItem[];
    itemSearch: ItemSearch;
    itemClicked = new EventEmitter();
    columnAction= new EventEmitter();
     loading:boolean = false;
    lang:Locale;

    constructor(itemService:ItemService, applicationService:ApplicationService,
                @Attribute('selectable') selectable,
                @Attribute('headers') headers) {
        this.itemService = itemService;
        this.lang = applicationService.locale;

        if (selectable != undefined) {
            this.propSelectable = selectable != 'false';
        } else {
            this.propSelectable = true;
        }
        if (headers != undefined) {
            this.propHeaders = headers != 'false';
        } else {
            this.propHeaders = true;
        }
    }




    onItemClick(item:Item, col: ItemColumn) {
        if (col == ItemColumn.ACTION_REMOVE) {
            return;
        }
        this.itemClicked.next(item);
    }

    onColumnAction(event: any) {
        this.columnAction.next(event);
        console.log("click");
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

    title:LocaleText;
    name:string;
    alignRight:boolean;

    static init() {
        ItemColumn.REFERENCE = new ItemColumn();
        ItemColumn.REFERENCE.name = 'ref';
        ItemColumn.REFERENCE.title = LocaleTextFactory.getLocaleTextFromJSON({
            localeTextMap: {
                'fr': "Ref"
            }
        });

        ItemColumn.NAME = new ItemColumn();
        ItemColumn.NAME.name = 'name';
        ItemColumn.NAME.title = LocaleTextFactory.getLocaleTextFromJSON({
            localeTextMap: {
                'fr': "Nom"
            }
        });

        ItemColumn.MODEL = new ItemColumn();
        ItemColumn.MODEL.name = 'model';
        ItemColumn.MODEL.title = LocaleTextFactory.getLocaleTextFromJSON({
            localeTextMap: {
                'fr': "Modèle"
            }
        });

        ItemColumn.DESCRIPTION = new ItemColumn();
        ItemColumn.DESCRIPTION.name = 'description';
        ItemColumn.DESCRIPTION.title = LocaleTextFactory.getLocaleTextFromJSON({
            localeTextMap: {
                'fr': "Description"
            }
        });

        ItemColumn.NAME_MODEL = new ItemColumn();
        ItemColumn.NAME_MODEL.name = 'name_model';
        ItemColumn.NAME_MODEL.title = LocaleTextFactory.getLocaleTextFromJSON({
            localeTextMap: {
                'fr': "Nom / Modèle"
            }
        });

        ItemColumn.TVA_EXCLUSIVE = new ItemColumn();
        ItemColumn.TVA_EXCLUSIVE.name = 'tva_excl';
        ItemColumn.TVA_EXCLUSIVE.alignRight = true;
        ItemColumn.TVA_EXCLUSIVE.title = LocaleTextFactory.getLocaleTextFromJSON({
            localeTextMap: {
                'fr': "Prix HTVA"
            }
        });

        ItemColumn.TVA_RATE = new ItemColumn();
        ItemColumn.TVA_RATE.name = 'tva_rate';
        ItemColumn.TVA_RATE.alignRight = true;
        ItemColumn.TVA_RATE.title = LocaleTextFactory.getLocaleTextFromJSON({
            localeTextMap: {
                'fr': "TVA%"
            }
        });

        ItemColumn.PICTURE = new ItemColumn();
        ItemColumn.PICTURE.name = 'picture';
        ItemColumn.PICTURE.title = LocaleTextFactory.getLocaleTextFromJSON({
            localeTextMap: {
                'fr': "Image"
            }
        });

        ItemColumn.ACTION_REMOVE = new ItemColumn();
        ItemColumn.ACTION_REMOVE.name = 'action_remove';
        ItemColumn.ACTION_REMOVE.title = null;
    }
}

ItemColumn.init();
