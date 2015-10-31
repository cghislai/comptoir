/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf, FORM_DIRECTIVES, EventEmitter, OnInit} from 'angular2/angular2';

import {LocalAccount, LocalAccountFactory, NewAccount} from '../../../client/localDomain/account';

import {AccountType, ALL_ACCOUNT_TYPES} from '../../../client/domain/account';

import {Language} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';
import {AccountService} from '../../../services/account';
import {ErrorService} from '../../../services/error';

import {LangSelect} from '../../lang/langSelect/langSelect';
import {LocalizedDirective} from '../../utils/localizedInput';
import {RequiredValidator} from '../../utils/validators';
import {FormMessage} from '../../utils/formMessage/formMessage';

import * as Immutable from 'immutable';

@Component({
    selector: 'accountEditComponent',
    inputs: ['account'],
    outputs: ['saved', 'cancelled']
})
@View({
    templateUrl: './components/account/edit/editAccount.html',
    styleUrls: ['./components/account/edit/editAccount.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, LangSelect, LocalizedDirective,
        RequiredValidator, FormMessage]
})
export class AccountsEditComponent implements OnInit {
    accountService:AccountService;
    errorService:ErrorService;
    authService:AuthService;

    account:LocalAccount;
    accountModel:any;

    editLanguage:Language;
    appLanguage:Language;

    saved = new EventEmitter();
    cancelled = new EventEmitter();

    allAccountTypes:Immutable.List<AccountType>;

    constructor(accountService:AccountService, authService:AuthService, errorService:ErrorService) {
        this.accountService = accountService;
        this.authService = authService;
        this.errorService = errorService;
        var language = authService.getEmployeeLanguage();
        this.editLanguage = language;
        this.appLanguage = language;
        this.allAccountTypes = Immutable.List(ALL_ACCOUNT_TYPES);
    }

    onInit() {
        this.accountModel = this.account.toJS();
    }

    getAccountTypeLabel(accountType:AccountType) {
        return LocalAccountFactory.getAccountTypeLabel(accountType).get(this.appLanguage.locale);
    }


    onFormSubmit() {
        var account = NewAccount(this.accountModel);
        this.saveAccount(account)
            .then((account)=> {
                this.saved.next(account);
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onCancelClicked() {
        this.cancelled.next(null);
    }

    private saveAccount(account:LocalAccount):Promise<LocalAccount> {
        return this.accountService.save(account)
            .then((ref)=> {
                return this.accountService.get(ref.id);
            })
            .then((account:LocalAccount)=> {
                this.account = account;
                this.accountModel = account.toJS();
                return account;
            });
    }

}
