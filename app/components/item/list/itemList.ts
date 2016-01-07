/**
 * Created by cghislai on 29/07/15.
 */

import {Component, ChangeDetectionStrategy, OnInit,
    EventEmitter, ViewEncapsulation} from 'angular2/core';
import {NgFor, NgIf, NgSwitch, NgSwitchWhen} from 'angular2/common';

import {LocalItem} from '../../../client/localDomain/item';

import {Language, LocaleTextsFactory} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';

import {FocusableDirective} from '../../utils/focusable';
import {Column} from '../../utils/column';

import * as Immutable from 'immutable';
/****
 * Column component
 */
@Component({
    selector: 'item-column',
    inputs: ['item', 'column', 'lang'],
    outputs: ['action'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    selector: 'item-list',
    inputs: ['items', 'columns', 'rowSelectable', 'headersVisible'],
    outputs: ['rowClicked', 'columnAction'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/item/list/itemList.html',
    styleUrls: ['./components/item/list/itemList.css'],
    directives: [NgFor, NgIf, FocusableDirective, ItemColumnComponent]
})

export class ItemList implements OnInit {
    // properties
    items:Immutable.List<LocalItem>;
    columns:Immutable.List<ItemColumn>;
    itemSelectable:boolean;
    headersVisible:boolean;
    language:Language;
    columnWeightToPercentage:number;

    rowClicked = new EventEmitter();
    columnAction = new EventEmitter();

    constructor(authService:AuthService) {
        this.language = authService.getEmployeeLanguage();
    }

    ngOnInit() {
        this.calcColumnWeightFactor();
    }

    calcColumnWeightFactor() {
        let totWeight = this.columns.valueSeq()
            .reduce((r, col)=>r + col.weight, 0);
        this.columnWeightToPercentage = 100.0 / totWeight;
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

export class ItemColumn extends Column {

    static ID:ItemColumn;
    static REFERENCE:ItemColumn;
    static NAME:ItemColumn;
    static DESCRIPTION:ItemColumn;
    static NAME_AND_DESCRIPTION:ItemColumn;
    static VAT_EXCLUSIVE:ItemColumn;
    static VAT_RATE:ItemColumn;
    static VAT_INCLUSIVE:ItemColumn;
    static PICTURE:ItemColumn;
    static ACTION_REMOVE:ItemColumn;

    static init() {
        ItemColumn.ID = new ItemColumn(
            'id', 1,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Id'
            })
        );

        ItemColumn.REFERENCE = new ItemColumn(
            'ref', 1,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Ref'
            })
        );

        ItemColumn.NAME = new ItemColumn(
            'name', 3,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Nom'
            })
        );

        ItemColumn.DESCRIPTION = new ItemColumn(
            'description', 5,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Description'
            })
        );

        ItemColumn.NAME_AND_DESCRIPTION = new ItemColumn(
            'name_and_description', 5,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Nom / Description'
            })
        );

        ItemColumn.VAT_EXCLUSIVE = new ItemColumn(
            'vat_exclusive', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Prix HTVA'
            }), true
        );

        ItemColumn.VAT_RATE = new ItemColumn(
            'vat_rate', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Taux TVA'
            }), true
        );

        ItemColumn.VAT_INCLUSIVE = new ItemColumn(
            'vat_inclusive', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Prix'
            }), true
        );

        ItemColumn.PICTURE = new ItemColumn(
            'picture', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Image'
            }), false, true
        );

        ItemColumn.ACTION_REMOVE = new ItemColumn(
            'action_remove', 1
        );
    }
}

ItemColumn.init();
