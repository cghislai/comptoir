/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf,
    EventEmitter, Attribute, ViewEncapsulation} from 'angular2/angular2';

import {LocalSale} from 'client/localDomain/sale';
import {LocaleTexts} from 'client/utils/lang';

import {AuthService} from 'services/auth';

import {AutoFocusDirective} from 'components/utils/autoFocus';
import {FocusableDirective} from 'components/utils/focusable';


/****
 * Column component
 */
@Component({
    selector: "saleColumn",
    properties: ['sale', 'column', 'lang'],
    events: ['action']
})
@View({
    templateUrl: './components/sales/list/saleColumn.html',
    styleUrls: ['./components/sales/list/saleList.css'],
    directives: [NgIf],
    // eases styling
    encapsulation: ViewEncapsulation.NONE
})
export class SaleColumnComponent {
    action = new EventEmitter();

    onColumnAction(sale:LocalSale, column:SaleColumn, event) {
        this.action.next({sale: sale, column: column});
        //  event.stopPropagation();
    }

}


/*****
 * List component
 */

@Component({
    selector: 'saleList',
    properties: ['sales', 'columns', 'selectableParam: selectable', 'headersParams: headers'],
    events: ['saleClicked', 'columnAction']
})

@View({
    templateUrl: './components/sales/list/saleList.html',
    styleUrls: ['./components/sales/list/saleList.css'],
    directives: [NgFor, NgIf, AutoFocusDirective, FocusableDirective, SaleColumnComponent]
})

export class SaleListComponent {
    // properties
    sales:LocalSale[];
    columns:SaleColumn[];
    selectable:boolean;
    headers:boolean;

    saleClicked = new EventEmitter();
    columnAction = new EventEmitter();
    locale:string;

    constructor(authService:AuthService) {
        this.locale = authService.getEmployeeLanguage().locale;
    }

    set headersParams(value: string) {
        this.headers = value != 'false';
    }

    set selectableParam(value: string) {
        this.selectable = value != 'false';
    }

    onSaleClick(sale: LocalSale, col: SaleColumn) {
        if (col == SaleColumn.ACTION_REMOVE) {
            return;
        }
        this.saleClicked.next(sale);
    }

    onColumnAction(event:any) {
        this.columnAction.next(event);
    }

}

export class SaleColumn {

    static ID: SaleColumn;
    static DATETIME: SaleColumn;
    static VAT_EXCLUSIVE_AMOUNT: SaleColumn;
    static VAT_AMOUNT: SaleColumn;
    static CLOSED: SaleColumn;
    static REFERENCE:SaleColumn;
    static ACTION_REMOVE: SaleColumn;
    
    title:LocaleTexts;
    name:string;
    alignRight:boolean;

    static init() {
        SaleColumn.ID = new SaleColumn();
        SaleColumn.ID.name = 'id';
        SaleColumn.ID.title = {
            'fr': "Id"
        };

        SaleColumn.DATETIME = new SaleColumn();
        SaleColumn.DATETIME.name = 'dateTime';
        SaleColumn.DATETIME.title = {
            'fr': "Date"
        };

        SaleColumn.VAT_EXCLUSIVE_AMOUNT = new SaleColumn();
        SaleColumn.VAT_EXCLUSIVE_AMOUNT.name = 'vatExclusive';
        SaleColumn.VAT_EXCLUSIVE_AMOUNT.alignRight = true;
        SaleColumn.VAT_EXCLUSIVE_AMOUNT.title = {
            'fr': "Total HTVA"
        };

        SaleColumn.VAT_AMOUNT = new SaleColumn();
        SaleColumn.VAT_AMOUNT.name = 'vat';
        SaleColumn.VAT_AMOUNT.alignRight = true;
        SaleColumn.VAT_AMOUNT.title = {
        'fr': "TVA"
        };

        SaleColumn.CLOSED = new SaleColumn();
        SaleColumn.CLOSED.name = 'closed';
        SaleColumn.CLOSED.title = {
            'fr': "Clôturée"
        };

        SaleColumn.REFERENCE = new SaleColumn();
        SaleColumn.REFERENCE.name = 'ref';
        SaleColumn.REFERENCE.title = {
            'fr': "Référence"
        };



        SaleColumn.ACTION_REMOVE = new SaleColumn();
        SaleColumn.ACTION_REMOVE.name = 'action_remove';
        SaleColumn.ACTION_REMOVE.title = null;
    }
}

SaleColumn.init();
