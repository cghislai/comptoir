/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf,
    EventEmitter, Attribute} from 'angular2/angular2';

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
    properties: ['picItem: item', 'column', 'lang']
})
@View({
    templateUrl: './components/items/itemList/itemColumn.html',
    styleUrls: ['./components/items/itemList/itemList.css'],
    directives: [NgIf]
})
export class ItemColumnComponent {

}


/*****
 * List component
 */

@Component({
    selector: 'itemList',
    properties: ['propColumns: columns', 'propSearch: search', 'selectable', 'headers'],
    events: ['itemClicked']
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
    propSearch:ItemSearch;

    itemService:ItemService;
    items:PicturedItem[];
    itemCount:number;
    itemClicked = new EventEmitter();
    loading:boolean = false;
    lang:Locale;

    constructor(itemService:ItemService, applicationService:ApplicationService,
                @Attribute('search') search,
                @Attribute('columns') columns,
                @Attribute('selectable') selectable,
                @Attribute('headers') headers) {
        this.itemService = itemService;
        this.lang = applicationService.locale;
/*
        if (search != undefined) {
            this.propSearch = search;
        } else {
            this.propSearch = new ItemSearch();
            this.propSearch.pagination = new Pagination(0, 10);
        }
        if (columns != undefined) {
            this.propColumns = columns;
        } else {
            this.propColumns = ItemColumn.ALL_COLUMNS;
        }*/
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


        this.searchItems();
    }


    searchItems(itemSearch?:ItemSearch) {
        if (itemSearch != undefined) {
            this.propSearch = itemSearch;
        }
        this.loading = true;
        var thisList = this;
        // TODO: cancel running promises
        this.itemService.searchPicturedItems(this.propSearch)
            .then(function (result) {
                thisList.itemCount = result.count;
                thisList.items = result.list;
                thisList.loading = false;
            })
    }

    onItemClick(item:Item) {
        this.itemClicked.next(item);
    }

    doremoveItem(item:Item) {
        var thisList = this;
        this.itemService.removeItem(item)
            .then(()=> {
                thisList.searchItems();
            });
    }

    onColumnAction(item: PicturedItem, column: ItemColumn) {
        switch (column) {
            case (ItemColumn.ACTION_REMOVE): {
                this.doremoveItem(item.item);
                break;
            }
        }
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
    alignRight: boolean;

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
        ItemColumn.ACTION_REMOVE.name = 'action_    remove';
        ItemColumn.ACTION_REMOVE.title = null;
    }
}

ItemColumn.init();
