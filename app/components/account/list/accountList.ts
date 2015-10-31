/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, NgSwitch, NgSwitchWhen,
    ChangeDetectionStrategy,
    EventEmitter, ViewEncapsulation} from 'angular2/angular2';

import {LocalAccount} from '../../../client/localDomain/account';

import {Language, LanguageFactory, LocaleTexts, LocaleTextsFactory} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';

import {FocusableDirective} from '../../utils/focusable';

import * as Immutable from 'immutable';
/****
 * Column component
 */
@Component({
    selector: "accountColumn",
    inputs: ['account', 'column', 'lang'],
    outputs: ['action'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@View({
    templateUrl: './components/account/list/accountColumn.html',
    styleUrls: ['./components/account/list/accountList.css'],
    directives: [NgIf, NgSwitch, NgSwitchWhen, FocusableDirective],
    // eases styling
    encapsulation: ViewEncapsulation.None
})
export class AccountColumnComponent {
    action = new EventEmitter();
    account:LocalAccount;
    column:AccountColumn;
    lang:Language;

    onColumnAction(account:LocalAccount, column:AccountColumn, event) {
        this.action.next({account: account, column: column});
        event.stopPropagation();
        event.preventDefault();
    }

}


/*****
 * List component
 */

@Component({
    selector: 'accountList',
    inputs: ['accounts', 'columns', 'rowSelectable', 'headersVisible'],
    outputs: ['rowClicked', 'columnAction'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

@View({
    templateUrl: './components/account/list/accountList.html',
    styleUrls: ['./components/account/list/accountList.css'],
    directives: [NgFor, NgIf, FocusableDirective, AccountColumnComponent]
})

export class AccountList {
    // properties
    accounts:Immutable.List<LocalAccount>;
    columns:Immutable.List<AccountColumn>;
    accountSelectable:boolean;
    headersVisible:boolean;
    language: Language;

    rowClicked = new EventEmitter();
    columnAction = new EventEmitter();

    constructor(authService:AuthService) {
        this.language = authService.getEmployeeLanguage();
    }


    onAccountClick(account:LocalAccount, event) {
        this.rowClicked.next(account);
        event.stopPropagation();
        event.preventDefault();
    }

    onColumnAction(event:any) {
        this.columnAction.next(event);
    }

}

export class AccountColumn {

    static ID:AccountColumn;
    static ACCOUNTING_NUMBER:AccountColumn;
    static IBAN:AccountColumn;
    static BIC:AccountColumn;
    static NAME:AccountColumn;
    static DESCRIPTION:AccountColumn;
    static TYPE:AccountColumn;
    static ACTION_REMOVE:AccountColumn;

    title:LocaleTexts;
    name:string;
    alignRight:boolean;
    alignCenter:boolean;

    static init() {
        AccountColumn.ID = new AccountColumn();
        AccountColumn.ID.name = 'id';
        AccountColumn.ID.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Id"
        });

        AccountColumn.ACCOUNTING_NUMBER = new AccountColumn();
        AccountColumn.ACCOUNTING_NUMBER.name = 'accountingNumber';
        AccountColumn.ACCOUNTING_NUMBER.alignRight = true;
        AccountColumn.ACCOUNTING_NUMBER.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Numéro de comptabilité"
        });

        AccountColumn.IBAN = new AccountColumn();
        AccountColumn.IBAN.name = 'iban';
        AccountColumn.IBAN.alignRight = true;
        AccountColumn.IBAN.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "IBAN"
        });

        AccountColumn.BIC = new AccountColumn();
        AccountColumn.BIC.name = 'bic';
        AccountColumn.BIC.alignRight = true;
        AccountColumn.BIC.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "BIC"
        });

        AccountColumn.NAME = new AccountColumn();
        AccountColumn.NAME.name = 'name';
        AccountColumn.NAME.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Nom"
        });

        AccountColumn.DESCRIPTION = new AccountColumn();
        AccountColumn.DESCRIPTION.name = 'description';
        AccountColumn.DESCRIPTION.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Description"
        });

        AccountColumn.TYPE = new AccountColumn();
        AccountColumn.TYPE.name = 'type';
        AccountColumn.TYPE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Type"
        });

        AccountColumn.ACTION_REMOVE = new AccountColumn();
        AccountColumn.ACTION_REMOVE.name = 'action_remove';
        AccountColumn.ACTION_REMOVE.title = null;
    }
}

AccountColumn.init();
