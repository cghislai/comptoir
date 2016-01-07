/**
 * Created by cghislai on 29/07/15.
 */

import {Component,    ChangeDetectionStrategy, OnInit,    EventEmitter, ViewEncapsulation} from 'angular2/core';
import {NgFor, NgIf, NgSwitch, NgSwitchWhen} from 'angular2/common';

import {LocalItemVariant, LocalItemVariantFactory} from '../../../client/localDomain/itemVariant';
import {Pricing} from '../../../client/domain/itemVariant';

import {Language, LocaleTextsFactory} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';

import {FocusableDirective} from '../../utils/focusable';
import {Column} from '../../utils/column';

import * as Immutable from 'immutable';

/****
 * Column component
 */
@Component({
    selector: 'item-variant-column',
    inputs: ['itemVariant', 'column', 'lang'],
    outputs: ['action'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/itemVariant/list/itemVariantColumn.html',
    styleUrls: ['./components/itemVariant/list/itemVariantList.css'],
    directives: [NgIf, NgFor, NgSwitch, NgSwitchWhen, FocusableDirective],
    // eases styling
    encapsulation: ViewEncapsulation.None
})
export class ItemVariantColumnComponent {
    action = new EventEmitter();
    itemVariant:LocalItemVariant;
    column:ItemVariantColumn;
    lang:Language;

    onColumnAction(item:LocalItemVariant, column:ItemVariantColumn, event) {
        this.action.next({itemVariant: item, column: column});
        event.stopPropagation();
        event.preventDefault();
    }

    getPricingLabel(pricing:Pricing) {
        return LocalItemVariantFactory.getPricingLabel(pricing).get(this.lang.locale);
    }

    getVariantPrice(itemVariant:LocalItemVariant) {
        return LocalItemVariantFactory.calcPrice(itemVariant, true);
    }
}


/*****
 * List component
 */

@Component({
    selector: 'item-variant-list',
    inputs: ['items', 'columns', 'rowSelectable', 'headersVisible'],
    outputs: ['rowClicked', 'columnAction'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/itemVariant/list/itemVariantList.html',
    styleUrls: ['./components/itemVariant/list/itemVariantList.css'],
    directives: [NgFor, NgIf, FocusableDirective, ItemVariantColumnComponent]
})

export class ItemVariantList implements OnInit {
    // properties
    items:Immutable.List<LocalItemVariant>;
    columns:Immutable.List<ItemVariantColumn>;
    rowSelectable:boolean;
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

    onItemClick(item:LocalItemVariant, event) {
        this.rowClicked.next(item);
        event.stopPropagation();
        event.preventDefault();
    }

    onColumnAction(event:any) {
        this.columnAction.next(event);
    }

}

export class ItemVariantColumn extends Column {

    static ID:ItemVariantColumn;
    static VARIANT_REFERENCE:ItemVariantColumn;
    static PICTURE:ItemVariantColumn;
    static PICTURE_NO_ITEM_FALLBACK:ItemVariantColumn;
    static PRICING:ItemVariantColumn;
    static PRICING_AMOUNT:ItemVariantColumn;
    static ATTRIBUTES:ItemVariantColumn;

    static ITEM_REFERENCE:ItemVariantColumn;
    static ITEM_NAME:ItemVariantColumn;
    static ITEM_DESCRIPTION:ItemVariantColumn;
    static ITEM_NAME_VARIANT_ATTRIBUTES:ItemVariantColumn;
    static ITEM_VAT_EXCLUSIVE:ItemVariantColumn;
    static ITEM_VAT_RATE:ItemVariantColumn;
    static ITEM_VAT_INCLUSIVE:ItemVariantColumn;

    static TOTAL_PRICE:ItemVariantColumn;

    static ACTION_REMOVE:ItemVariantColumn;
    static ALL_COLUMNS:ItemVariantColumn[];

    static init() {
        ItemVariantColumn.ID = new ItemVariantColumn(
            'id', 1,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Id'
            })
        );

        ItemVariantColumn.VARIANT_REFERENCE = new ItemVariantColumn(
            'variantReference', 1,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Ref'
            })
        );

        ItemVariantColumn.PICTURE = new ItemVariantColumn(
            'picture', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Image'
            }), false, true
        );

        ItemVariantColumn.PICTURE_NO_ITEM_FALLBACK = new ItemVariantColumn(
            'pictureNoItemFallback', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Image'
            }), false, true
        );

        ItemVariantColumn.PRICING = new ItemVariantColumn(
            'pricing', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Mode tarification'
            })
        );

        ItemVariantColumn.PRICING_AMOUNT = new ItemVariantColumn(
            'pricingAmount', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Valeur tarification'
            }), true
        );

        ItemVariantColumn.ATTRIBUTES = new ItemVariantColumn(
            'attributes', 5,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Attributs'
            })
        );

        ItemVariantColumn.ITEM_REFERENCE = new ItemVariantColumn(
            'itemReference', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Ref (parent)'
            })
        );

        ItemVariantColumn.ITEM_NAME = new ItemVariantColumn(
            'itemName', 3,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Nom'
            })
        );

        ItemVariantColumn.ITEM_DESCRIPTION = new ItemVariantColumn(
            'itemDescription', 5,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Description'
            })
        );

        ItemVariantColumn.ITEM_NAME_VARIANT_ATTRIBUTES = new ItemVariantColumn(
            'itemNameVariantAttributes', 5,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Nom / Attributs'
            })
        );

        ItemVariantColumn.ITEM_VAT_EXCLUSIVE = new ItemVariantColumn(
            'itemVatExclusive', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Prix HTVA (parent)'
            }), true
        );

        ItemVariantColumn.ITEM_VAT_RATE = new ItemVariantColumn(
            'itemVatRate', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Taux TVA'
            }), true
        );

        ItemVariantColumn.ITEM_VAT_INCLUSIVE = new ItemVariantColumn(
            'itemVatInclusive', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Prix (parent)'
            }), true
        );

        ItemVariantColumn.TOTAL_PRICE = new ItemVariantColumn(
            'totalPrice', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Prix total'
            }), true
        );

        ItemVariantColumn.ACTION_REMOVE = new ItemVariantColumn(
            'action_remove', 1
        );
    }
}

ItemVariantColumn.init();
