/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, NgFor, NgIf, NgSwitch, NgSwitchWhen, ChangeDetectionStrategy,
    EventEmitter, ViewEncapsulation} from 'angular2/angular2';

import {Pos} from '../../../client/domain/pos';

import {Language, LanguageFactory, LocaleTexts, LocaleTextsFactory} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';

import {FocusableDirective} from '../../utils/focusable';

import {List} from 'immutable';

/****
 * Column component
 */
@Component({
    selector: "posColumn",
    inputs: ['pos', 'column', 'lang'],
    outputs: ['action'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@View({
    templateUrl: './components/pos/list/posColumn.html',
    styleUrls: ['./components/pos/list/posList.css'],
    directives: [NgIf, NgFor, NgSwitch, NgSwitchWhen],
    // eases styling
    encapsulation: ViewEncapsulation.None,

})
export class PosColumnComponent {
    action = new EventEmitter();
    pos:Pos;
    column:PosColumn;
    lang:Language;

    onColumnAction(pos:Pos, column:PosColumn, event) {
        this.action.next({pos: pos, column: column});
        event.stopPropagation();
        event.preventDefault();
    }
}


/*****
 * List component
 */

@Component({
    selector: 'posList',
    inputs: ['posList', 'columns', 'rowSelectable', 'headersVisible'],
    outputs: ['rowClicked', 'columnAction'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

@View({
    templateUrl: './components/pos/list/posList.html',
    styleUrls: ['./components/pos/list/posList.css'],
    directives: [NgFor, NgIf, FocusableDirective, PosColumnComponent]
})

export class PosList {
    // properties
    posList:List<Pos>;
    columns:List<PosColumn>;
    rowSelectable:boolean;
    headersVisible:boolean;
    language:Language;

    rowClicked = new EventEmitter();
    columnAction = new EventEmitter();

    constructor(authService:AuthService) {
        this.language = authService.getEmployeeLanguage();
    }


    onPosClick(item:Pos, event) {
        this.rowClicked.next(item);
        event.stopPropagation();
        event.preventDefault();
    }

    onColumnAction(event:any) {
        this.columnAction.next(event);
    }

}

export class PosColumn {

    static ID:PosColumn;
    static NAME:PosColumn;
    static DESCRIPTION:PosColumn;
    static DEFAULT_CUSTOMER:PosColumn;

    static ACTION_REMOVE:PosColumn;

    title:LocaleTexts;
    name:string;
    alignRight:boolean;
    alignCenter:boolean;

    static init() {
        PosColumn.ID = new PosColumn();
        PosColumn.ID.name = 'id';
        PosColumn.ID.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Id"
        });

        PosColumn.NAME = new PosColumn();
        PosColumn.NAME.name = 'name';
        PosColumn.NAME.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Nom"
        });

        PosColumn.DESCRIPTION = new PosColumn();
        PosColumn.DESCRIPTION.name = 'description';
        PosColumn.DESCRIPTION.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Description"
        });

        PosColumn.DEFAULT_CUSTOMER = new PosColumn();
        PosColumn.DEFAULT_CUSTOMER.name = 'defaultCustomer';
        PosColumn.DEFAULT_CUSTOMER.title = LocaleTextsFactory.toLocaleTexts({
            'fr': "Client par défaut"
        });


        PosColumn.ACTION_REMOVE = new PosColumn();
        PosColumn.ACTION_REMOVE.name = 'action_remove';
        PosColumn.ACTION_REMOVE.title = null;
    }
}

PosColumn.init();
