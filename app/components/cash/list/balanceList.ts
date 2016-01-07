/**
 * Created by cghislai on 29/07/15.
 */

import {Component,ChangeDetectionStrategy, OnInit,
    EventEmitter, ViewEncapsulation} from 'angular2/core';
import {NgFor, NgIf, NgSwitch, NgSwitchWhen} from 'angular2/common';

import {LocalBalance} from '../../../client/localDomain/balance';

import {Language, LocaleTextsFactory} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';

import {FocusableDirective} from '../../utils/focusable';
import {Column} from '../../utils/column';

import * as Immutable from 'immutable';
/****
 * Column component
 */
@Component({
    selector: 'balance-column',
    inputs: ['balance', 'column', 'lang'],
    outputs: ['action'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/cash/list/balanceColumn.html',
    styleUrls: ['./components/cash/list/balanceList.css'],
    directives: [NgIf, NgSwitch, NgSwitchWhen, FocusableDirective],
    // eases styling
    encapsulation: ViewEncapsulation.None
})
export class BalanceColumnComponent {
    action = new EventEmitter();
    balance:LocalBalance;
    column:BalanceColumn;
    lang:Language;

    onColumnAction(balance:LocalBalance, column:BalanceColumn, event) {
        this.action.next({balance: balance, column: column});
        event.stopPropagation();
        event.preventDefault();
    }

}


/*****
 * List component
 */

@Component({
    selector: 'balance-list',
    inputs: ['balances', 'columns', 'rowSelectable', 'headersVisible'],
    outputs: ['rowClicked', 'columnAction'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/cash/list/balanceList.html',
    styleUrls: ['./components/cash/list/balanceList.css'],
    directives: [NgFor, NgIf, FocusableDirective, BalanceColumnComponent]
})

export class BalanceList implements OnInit {
    // properties
    balances:Immutable.List<LocalBalance>;
    columns:Immutable.List<BalanceColumn>;
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


    onBalanceClick(balance:LocalBalance, event) {
        this.rowClicked.next(balance);
        event.stopPropagation();
        event.preventDefault();
    }

    onColumnAction(event:any) {
        this.columnAction.next(event);
    }

}

export class BalanceColumn extends Column {

    static ID:BalanceColumn;
    static ACCOUNT:BalanceColumn;
    static DATETIME:BalanceColumn;
    static BALANCE:BalanceColumn;
    static COMMENT:BalanceColumn;
    static CLOSED:BalanceColumn;
    static ACTION_REMOVE:BalanceColumn;

    static init() {
        BalanceColumn.ID = new BalanceColumn(
            'id', 1,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Id'
            })
        );
        BalanceColumn.ACCOUNT = new BalanceColumn(
            'account', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Compte'
            })
        );

        BalanceColumn.DATETIME = new BalanceColumn(
            'dateTime', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Date'
            })
        );

        BalanceColumn.BALANCE = new BalanceColumn(
            'balance', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Solde'
            }), true
        );

        BalanceColumn.COMMENT = new BalanceColumn(
            'comment', 4,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Commentaire'
            })
        );

        BalanceColumn.CLOSED = new BalanceColumn(
            'closed', 1,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Clôturée'
            }), false, true
        );

        BalanceColumn.ACTION_REMOVE = new BalanceColumn(
            'action_remove', 1
        );
    }
}

BalanceColumn.init();
