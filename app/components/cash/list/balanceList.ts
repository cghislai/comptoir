/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, NgSwitch, NgSwitchWhen,
    ChangeDetectionStrategy,
    EventEmitter, ViewEncapsulation} from 'angular2/angular2';

import {LocalBalance} from 'client/localDomain/balance';

import {Language, LanguageFactory, LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';

import {AuthService} from 'services/auth';

import {FocusableDirective} from 'components/utils/focusable';

import {List} from 'immutable';
/****
 * Column component
 */
@Component({
    selector: "balanceColumn",
    properties: ['balance', 'column', 'lang'],
    events: ['action'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@View({
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
    selector: 'balanceList',
    properties: ['balances', 'columns', 'rowSelectable', 'headersVisible'],
    events: ['rowClicked', 'columnAction'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

@View({
    templateUrl: './components/cash/list/balanceList.html',
    styleUrls: ['./components/cash/list/balanceList.css'],
    directives: [NgFor, NgIf, FocusableDirective, BalanceColumnComponent]
})

export class BalanceList {
    // properties
    balances:List<LocalBalance>;
    columns:List<BalanceColumn>;
    rowSelectable:boolean;
    headersVisible:boolean;
    language: Language;

    rowClicked = new EventEmitter();
    columnAction = new EventEmitter();

    constructor(authService:AuthService) {
        this.language = authService.getEmployeeLanguage();
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

export class BalanceColumn {

    static ID:BalanceColumn;
    static ACCOUNT:BalanceColumn;
    static DATETIME:BalanceColumn;
    static BALANCE:BalanceColumn;
    static COMMENT:BalanceColumn;
    static CLOSED:BalanceColumn;
    static ACTION_REMOVE:BalanceColumn;

    title:LocaleTexts;
    name:string;
    alignRight:boolean;
    alignCenter:boolean;

    static init() {
        BalanceColumn.ID = new BalanceColumn();
        BalanceColumn.ID.name = 'id';
        BalanceColumn.ID.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Id"
        });

        BalanceColumn.ACCOUNT = new BalanceColumn();
        BalanceColumn.ACCOUNT.name = 'account';
        BalanceColumn.ACCOUNT.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Compte"
        });

        BalanceColumn.DATETIME = new BalanceColumn();
        BalanceColumn.DATETIME.name = 'dateTime';
        BalanceColumn.DATETIME.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Date"
        });

        BalanceColumn.BALANCE = new BalanceColumn();
        BalanceColumn.BALANCE.name = 'balance';
        BalanceColumn.BALANCE.alignRight = true;
        BalanceColumn.BALANCE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Solde"
        });

        BalanceColumn.COMMENT = new BalanceColumn();
        BalanceColumn.COMMENT.name = 'comment';
        BalanceColumn.COMMENT.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Commentaire"
        });

        BalanceColumn.CLOSED = new BalanceColumn();
        BalanceColumn.CLOSED.name = 'closed';
        BalanceColumn.CLOSED.alignCenter = true;
        BalanceColumn.CLOSED.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Clôturée"
        });

        BalanceColumn.ACTION_REMOVE = new BalanceColumn();
        BalanceColumn.ACTION_REMOVE.name = 'action_remove';
        BalanceColumn.ACTION_REMOVE.title = null;
    }
}

BalanceColumn.init();
