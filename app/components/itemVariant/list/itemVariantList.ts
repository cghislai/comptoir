/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf,
    EventEmitter, Attribute, ViewEncapsulation} from 'angular2/angular2';

import {LocalItemVariant, LocalItemVariantFactory} from 'client/localDomain/itemVariant';
import {LocalPicture} from 'client/localDomain/picture';
import {Pricing, ItemVariantFactory} from 'client/domain/itemVariant';

import {LocaleTexts} from 'client/utils/lang';

import {AuthService} from 'services/auth';

import {AutoFocusDirective} from 'components/utils/autoFocus';
import {FocusableDirective} from 'components/utils/focusable';


/****
 * Column component
 */
@Component({
    selector: "itemVariantColumn",
    properties: ['itemVariant', 'column', 'lang'],
    events: ['action']
})
@View({
    templateUrl: './components/itemVariant/list/itemVariantColumn.html',
    styleUrls: ['./components/itemVariant/list/itemVariantList.css'],
    directives: [NgIf, NgFor, FocusableDirective],
    // eases styling
    encapsulation: ViewEncapsulation.None
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

    getPricingLabel(pricing: Pricing) {
        return LocalItemVariantFactory.getPricingLabel(pricing);
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
    templateUrl: './components/itemVariant/list/itemVariantList.html',
    styleUrls: ['./components/itemVariant/list/itemVariantList.css'],
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

    static TOTAL_PRICE: ItemVariantColumn;

    static ACTION_REMOVE:ItemVariantColumn;
    static ALL_COLUMNS:ItemVariantColumn[];

    title:LocaleTexts;
    name:string;
    alignRight:boolean;
    alignCenter:boolean;

    static init() {
        ItemVariantColumn.ID = new ItemVariantColumn();
        ItemVariantColumn.ID.name = 'id';
        ItemVariantColumn.ID.title = {
            'fr': "Id"
        };

        ItemVariantColumn.VARIANT_REFERENCE = new ItemVariantColumn();
        ItemVariantColumn.VARIANT_REFERENCE.name = 'variantReference';
        ItemVariantColumn.VARIANT_REFERENCE.title = {
            'fr': "Ref"
        };

        ItemVariantColumn.PICTURE = new ItemVariantColumn();
        ItemVariantColumn.PICTURE.name = 'picture';
        ItemVariantColumn.PICTURE.title = {
            'fr': "Image"
        };

        ItemVariantColumn.PICTURE_NO_ITEM_FALLBACK = new ItemVariantColumn();
        ItemVariantColumn.PICTURE_NO_ITEM_FALLBACK.name = 'pictureNoItemFallback';
        ItemVariantColumn.PICTURE_NO_ITEM_FALLBACK.title = {
            'fr': "Image"
        };

        ItemVariantColumn.PRICING = new ItemVariantColumn();
        ItemVariantColumn.PRICING.name = 'pricing';
        ItemVariantColumn.PRICING.title = {
            'fr': "Mode tarification"
        };

        ItemVariantColumn.PRICING_AMOUNT = new ItemVariantColumn();
        ItemVariantColumn.PRICING_AMOUNT.name = 'pricingAmount';
        ItemVariantColumn.PRICING_AMOUNT.title = {
            'fr': "Valeur tarification"
        };

        ItemVariantColumn.ATTRIBUTES = new ItemVariantColumn();
        ItemVariantColumn.ATTRIBUTES.name = 'attributes';
        ItemVariantColumn.ATTRIBUTES.title = {
            'fr': "Attributs"
        };

        ItemVariantColumn.ITEM_REFERENCE = new ItemVariantColumn();
        ItemVariantColumn.ITEM_REFERENCE.name = 'itemReference';
        ItemVariantColumn.ITEM_REFERENCE.title = {
            'fr': "Ref (parent)"
        };

        ItemVariantColumn.ITEM_NAME = new ItemVariantColumn();
        ItemVariantColumn.ITEM_NAME.name = 'itemName';
        ItemVariantColumn.ITEM_NAME.title = {
            'fr': "Nom"
        };

        ItemVariantColumn.ITEM_DESCRIPTION = new ItemVariantColumn();
        ItemVariantColumn.ITEM_DESCRIPTION.name = 'itemDescription';
        ItemVariantColumn.ITEM_DESCRIPTION.title = {
            'fr': "Description"
        };

        ItemVariantColumn.ITEM_NAME_VARIANT_ATTRIBUTES = new ItemVariantColumn();
        ItemVariantColumn.ITEM_NAME_VARIANT_ATTRIBUTES.name = 'itemNameVariantAttributes';
        ItemVariantColumn.ITEM_NAME_VARIANT_ATTRIBUTES.title = {
            'fr': "Nom / Attributs"
        };

        ItemVariantColumn.ITEM_VAT_EXCLUSIVE = new ItemVariantColumn();
        ItemVariantColumn.ITEM_VAT_EXCLUSIVE.name = 'itemVatExclusive';
        ItemVariantColumn.ITEM_VAT_EXCLUSIVE.alignRight = true;
        ItemVariantColumn.ITEM_VAT_EXCLUSIVE.title = {
            'fr': "Prix HTVA (parent)"
        };

        ItemVariantColumn.ITEM_VAT_RATE = new ItemVariantColumn();
        ItemVariantColumn.ITEM_VAT_RATE.name = 'itemVatRate';
        ItemVariantColumn.ITEM_VAT_RATE.alignRight = true;
        ItemVariantColumn.ITEM_VAT_RATE.title = {
            'fr': "Taux TVA"
        };

        ItemVariantColumn.ITEM_VAT_INCLUSIVE = new ItemVariantColumn();
        ItemVariantColumn.ITEM_VAT_INCLUSIVE.name = 'itemVatInclusive';
        ItemVariantColumn.ITEM_VAT_INCLUSIVE.alignRight = true;
        ItemVariantColumn.ITEM_VAT_INCLUSIVE.title = {
            'fr': "Prix (parent)"
        };

        ItemVariantColumn.TOTAL_PRICE = new ItemVariantColumn();
        ItemVariantColumn.TOTAL_PRICE.name = 'totalPrice';
        ItemVariantColumn.TOTAL_PRICE.alignRight = true;
        ItemVariantColumn.TOTAL_PRICE.title = {
            'fr': "Prix total"
        };

        ItemVariantColumn.ACTION_REMOVE = new ItemVariantColumn();
        ItemVariantColumn.ACTION_REMOVE.name = 'action_remove';
        ItemVariantColumn.ACTION_REMOVE.title = null;
    }
}

ItemVariantColumn.init();
