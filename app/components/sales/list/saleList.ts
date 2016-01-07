/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View,ChangeDetectionStrategy,EventEmitter, ViewEncapsulation} from 'angular2/core';
import { NgFor, NgIf, NgSwitch, NgSwitchWhen} from 'angular2/common';

import {LocalSale} from '../../../client/localDomain/sale';
import {Language, LocaleTexts, LocaleTextsFactory} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';

import {FocusableDirective} from '../../utils/focusable';

import * as Immutable from 'immutable';


/****
 * Column component
 */
@Component({
    selector: 'sale-column',
    inputs: ['sale', 'column', 'lang'],
    outputs: ['action'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/sales/list/saleColumn.html',
    styleUrls: ['./components/sales/list/saleList.css'],
    directives: [NgIf, NgSwitch, NgSwitchWhen],
    // eases styling
    encapsulation: ViewEncapsulation.None
})
export class SaleColumnComponent {
    action = new EventEmitter();
    sale:LocalSale;
    column:SaleColumn;
    lang:Language;

    onColumnAction(sale:LocalSale, column:SaleColumn, event) {
        this.action.next({sale: sale, column: column});
        event.stopPropagation();
        event.preventDefault();
    }

}


/*****
 * List component
 */

@Component({
    selector: 'sale-list',
    inputs: ['sales', 'columns', 'rowSelectable', 'headersVisible'],
    outputs: ['saleClicked', 'columnAction'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/sales/list/saleList.html',
    styleUrls: ['./components/sales/list/saleList.css'],
    directives: [NgFor, NgIf, FocusableDirective, SaleColumnComponent]
})

export class SaleListComponent {
    // properties
    sales:Immutable.List<LocalSale>;
    columns:Immutable.List<SaleColumn>;
    selectable:boolean;
    headers:boolean;
    language:Language;

    saleClicked = new EventEmitter();
    columnAction = new EventEmitter();

    constructor(authService:AuthService) {
        this.language = authService.getEmployeeLanguage();
    }

    onSaleClick(sale:LocalSale, event) {
        this.saleClicked.next(sale);
        event.stopPropagation();
        event.preventDefault();
    }

    onColumnAction(event:any) {
        this.columnAction.next(event);
    }

}

export class SaleColumn {

    static ID:SaleColumn;
    static DATETIME:SaleColumn;
    static VAT_EXCLUSIVE_AMOUNT:SaleColumn;
    static VAT_INCLUSIVE_AMOUNT:SaleColumn;
    static VAT_AMOUNT:SaleColumn;
    static CLOSED:SaleColumn;
    static REFERENCE:SaleColumn;
    static ACTION_REMOVE:SaleColumn;

    title:LocaleTexts;
    name:string;
    alignRight:boolean;

    static init() {
        SaleColumn.ID = new SaleColumn();
        SaleColumn.ID.name = 'id';
        SaleColumn.ID.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Id'
        });

        SaleColumn.DATETIME = new SaleColumn();
        SaleColumn.DATETIME.name = 'dateTime';
        SaleColumn.DATETIME.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Date'
        });

        SaleColumn.VAT_EXCLUSIVE_AMOUNT = new SaleColumn();
        SaleColumn.VAT_EXCLUSIVE_AMOUNT.name = 'vatExclusive';
        SaleColumn.VAT_EXCLUSIVE_AMOUNT.alignRight = true;
        SaleColumn.VAT_EXCLUSIVE_AMOUNT.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Total HTVA'
        });

        SaleColumn.VAT_INCLUSIVE_AMOUNT = new SaleColumn();
        SaleColumn.VAT_INCLUSIVE_AMOUNT.name = 'vatInclusive';
        SaleColumn.VAT_INCLUSIVE_AMOUNT.alignRight = true;
        SaleColumn.VAT_INCLUSIVE_AMOUNT.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Total'
        });

        SaleColumn.VAT_AMOUNT = new SaleColumn();
        SaleColumn.VAT_AMOUNT.name = 'vat';
        SaleColumn.VAT_AMOUNT.alignRight = true;
        SaleColumn.VAT_AMOUNT.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'TVA'
        });

        SaleColumn.CLOSED = new SaleColumn();
        SaleColumn.CLOSED.name = 'closed';
        SaleColumn.CLOSED.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Clôturée'
        });

        SaleColumn.REFERENCE = new SaleColumn();
        SaleColumn.REFERENCE.name = 'ref';
        SaleColumn.REFERENCE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Référence'
        });

        SaleColumn.ACTION_REMOVE = new SaleColumn();
        SaleColumn.ACTION_REMOVE.name = 'action_remove';
        SaleColumn.ACTION_REMOVE.title = null;
    }
}

SaleColumn.init();
