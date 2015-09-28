/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, NgSwitch, NgSwitchWhen,
    ChangeDetectionStrategy,
    EventEmitter, Attribute, ViewEncapsulation} from 'angular2/angular2';

import {LocalItem} from 'client/localDomain/item';
import {LocalPicture} from 'client/localDomain/picture';

import {Language, LanguageFactory, LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';

import {AuthService} from 'services/auth';

import {FocusableDirective} from 'components/utils/focusable';

import {List} from 'immutable';
/****
 * Column component
 */
@Component({
    selector: "itemColumn",
    properties: ['item', 'column', 'lang'],
    events: ['action'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@View({
    templateUrl: './components/item/list/itemColumn.html',
    styleUrls: ['./components/item/list/itemList.css'],
    directives: [NgIf, NgSwitch, NgSwitchWhen, FocusableDirective],
    // eases styling
    encapsulation: ViewEncapsulation.None
})
export class ItemColumnComponent {
    action = new EventEmitter();
    item:LocalItem;
    column:ItemColumn;
    lang:Language;

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
    events: ['rowClicked', 'columnAction'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

@View({
    templateUrl: './components/item/list/itemList.html',
    styleUrls: ['./components/item/list/itemList.css'],
    directives: [NgFor, NgIf, FocusableDirective, ItemColumnComponent]
})

export class ItemList {
    // properties
    items:List<LocalItem>;
    columns:List<ItemColumn>;
    itemSelectable:boolean;
    headersVisible:boolean;
    language: Language;

    rowClicked = new EventEmitter();
    columnAction = new EventEmitter();

    constructor(authService:AuthService) {
        this.language = authService.getEmployeeLanguage();
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
    static VAT_INCLUSIVE:ItemColumn;
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
        ItemColumn.ID.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Id"
        });

        ItemColumn.REFERENCE = new ItemColumn();
        ItemColumn.REFERENCE.name = 'ref';
        ItemColumn.REFERENCE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Ref"
        });

        ItemColumn.NAME = new ItemColumn();
        ItemColumn.NAME.name = 'name';
        ItemColumn.NAME.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Nom"
        });

        ItemColumn.DESCRIPTION = new ItemColumn();
        ItemColumn.DESCRIPTION.name = 'description';
        ItemColumn.DESCRIPTION.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Description"
        });

        ItemColumn.VAT_EXCLUSIVE = new ItemColumn();
        ItemColumn.VAT_EXCLUSIVE.name = 'vat_exclusive';
        ItemColumn.VAT_EXCLUSIVE.alignRight = true;
        ItemColumn.VAT_EXCLUSIVE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Prix HTVA"
        });

        ItemColumn.VAT_RATE = new ItemColumn();
        ItemColumn.VAT_RATE.name = 'vat_rate';
        ItemColumn.VAT_RATE.alignRight = true;
        ItemColumn.VAT_RATE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Taux TVA"
        });

        ItemColumn.VAT_INCLUSIVE = new ItemColumn();
        ItemColumn.VAT_INCLUSIVE.name = 'vat_inclusive';
        ItemColumn.VAT_INCLUSIVE.alignRight = true;
        ItemColumn.VAT_INCLUSIVE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Prix"
        });

        ItemColumn.PICTURE = new ItemColumn();
        ItemColumn.PICTURE.name = 'picture';
        ItemColumn.PICTURE.alignCenter = true;
        ItemColumn.PICTURE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Image"
        });

        ItemColumn.ACTION_REMOVE = new ItemColumn();
        ItemColumn.ACTION_REMOVE.name = 'action_remove';
        ItemColumn.ACTION_REMOVE.title = null;
    }
}

ItemColumn.init();
