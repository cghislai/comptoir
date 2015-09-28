/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, NgSwitch, NgSwitchWhen, ChangeDetectionStrategy,
    EventEmitter, Attribute, ViewEncapsulation} from 'angular2/angular2';

import {LocalItemVariant, LocalItemVariantFactory} from 'client/localDomain/itemVariant';
import {LocalPicture} from 'client/localDomain/picture';
import {Pricing, ItemVariantFactory} from 'client/domain/itemVariant';

import {Language, LanguageFactory, LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';

import {AuthService} from 'services/auth';

import {FocusableDirective} from 'components/utils/focusable';

import {List} from 'immutable';

/****
 * Column component
 */
@Component({
    selector: "itemVariantColumn",
    properties: ['itemVariant', 'column', 'lang'],
    events: ['action'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@View({
    templateUrl: './components/itemVariant/list/itemVariantColumn.html',
    styleUrls: ['./components/itemVariant/list/itemVariantList.css'],
    directives: [NgIf, NgFor, NgSwitch, NgSwitchWhen, FocusableDirective],
    // eases styling
    encapsulation: ViewEncapsulation.None,

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

    getVariantPrice(itemVariant: LocalItemVariant) {
        return LocalItemVariantFactory.calcPrice(itemVariant, true);
    }
}


/*****
 * List component
 */

@Component({
    selector: 'itemVariantList',
    properties: ['items', 'columns', 'rowSelectable', 'headersVisible'],
    events: ['rowClicked', 'columnAction'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

@View({
    templateUrl: './components/itemVariant/list/itemVariantList.html',
    styleUrls: ['./components/itemVariant/list/itemVariantList.css'],
    directives: [NgFor, NgIf, FocusableDirective, ItemVariantColumnComponent]
})

export class ItemVariantList {
    // properties
    items:List<LocalItemVariant>;
    columns:List<ItemVariantColumn>;
    itemSelectable:boolean;
    headersVisible:boolean;
    language:Language;

    rowClicked = new EventEmitter();
    columnAction = new EventEmitter();

    constructor(authService:AuthService) {
        this.language = authService.getEmployeeLanguage();
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

    static TOTAL_PRICE:ItemVariantColumn;

    static ACTION_REMOVE:ItemVariantColumn;
    static ALL_COLUMNS:ItemVariantColumn[];

    title:LocaleTexts;
    name:string;
    alignRight:boolean;
    alignCenter:boolean;

    static init() {
        ItemVariantColumn.ID = new ItemVariantColumn();
        ItemVariantColumn.ID.name = 'id';
        ItemVariantColumn.ID.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Id"
        });

        ItemVariantColumn.VARIANT_REFERENCE = new ItemVariantColumn();
        ItemVariantColumn.VARIANT_REFERENCE.name = 'variantReference';
        ItemVariantColumn.VARIANT_REFERENCE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Ref"
        });

        ItemVariantColumn.PICTURE = new ItemVariantColumn();
        ItemVariantColumn.PICTURE.name = 'picture';
        ItemVariantColumn.PICTURE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Image"
        });

        ItemVariantColumn.PICTURE_NO_ITEM_FALLBACK = new ItemVariantColumn();
        ItemVariantColumn.PICTURE_NO_ITEM_FALLBACK.name = 'pictureNoItemFallback';
        ItemVariantColumn.PICTURE_NO_ITEM_FALLBACK.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Image"
        });

        ItemVariantColumn.PRICING = new ItemVariantColumn();
        ItemVariantColumn.PRICING.name = 'pricing';
        ItemVariantColumn.PRICING.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Mode tarification"
        });

        ItemVariantColumn.PRICING_AMOUNT = new ItemVariantColumn();
        ItemVariantColumn.PRICING_AMOUNT.name = 'pricingAmount';
        ItemVariantColumn.PRICING_AMOUNT.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Valeur tarification"
        });

        ItemVariantColumn.ATTRIBUTES = new ItemVariantColumn();
        ItemVariantColumn.ATTRIBUTES.name = 'attributes';
        ItemVariantColumn.ATTRIBUTES.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Attributs"
        });

        ItemVariantColumn.ITEM_REFERENCE = new ItemVariantColumn();
        ItemVariantColumn.ITEM_REFERENCE.name = 'itemReference';
        ItemVariantColumn.ITEM_REFERENCE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Ref (parent)"
        });

        ItemVariantColumn.ITEM_NAME = new ItemVariantColumn();
        ItemVariantColumn.ITEM_NAME.name = 'itemName';
        ItemVariantColumn.ITEM_NAME.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Nom"
        });

        ItemVariantColumn.ITEM_DESCRIPTION = new ItemVariantColumn();
        ItemVariantColumn.ITEM_DESCRIPTION.name = 'itemDescription';
        ItemVariantColumn.ITEM_DESCRIPTION.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Description"
        });

        ItemVariantColumn.ITEM_NAME_VARIANT_ATTRIBUTES = new ItemVariantColumn();
        ItemVariantColumn.ITEM_NAME_VARIANT_ATTRIBUTES.name = 'itemNameVariantAttributes';
        ItemVariantColumn.ITEM_NAME_VARIANT_ATTRIBUTES.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Nom / Attributs"
        });

        ItemVariantColumn.ITEM_VAT_EXCLUSIVE = new ItemVariantColumn();
        ItemVariantColumn.ITEM_VAT_EXCLUSIVE.name = 'itemVatExclusive';
        ItemVariantColumn.ITEM_VAT_EXCLUSIVE.alignRight = true;
        ItemVariantColumn.ITEM_VAT_EXCLUSIVE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Prix HTVA (parent)"
        });

        ItemVariantColumn.ITEM_VAT_RATE = new ItemVariantColumn();
        ItemVariantColumn.ITEM_VAT_RATE.name = 'itemVatRate';
        ItemVariantColumn.ITEM_VAT_RATE.alignRight = true;
        ItemVariantColumn.ITEM_VAT_RATE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Taux TVA"
        });

        ItemVariantColumn.ITEM_VAT_INCLUSIVE = new ItemVariantColumn();
        ItemVariantColumn.ITEM_VAT_INCLUSIVE.name = 'itemVatInclusive';
        ItemVariantColumn.ITEM_VAT_INCLUSIVE.alignRight = true;
        ItemVariantColumn.ITEM_VAT_INCLUSIVE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Prix (parent)"
        });

        ItemVariantColumn.TOTAL_PRICE = new ItemVariantColumn();
        ItemVariantColumn.TOTAL_PRICE.name = 'totalPrice';
        ItemVariantColumn.TOTAL_PRICE.alignRight = true;
        ItemVariantColumn.TOTAL_PRICE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Prix total"
        });

        ItemVariantColumn.ACTION_REMOVE = new ItemVariantColumn();
        ItemVariantColumn.ACTION_REMOVE.name = 'action_remove';
        ItemVariantColumn.ACTION_REMOVE.title = null;
    }
}

ItemVariantColumn.init();
