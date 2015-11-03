/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgIf, ChangeDetectionStrategy} from 'angular2/angular2';
import {RouteParams, Router, RouterLink, OnActivate} from 'angular2/router';

import {LocalAccount, NewAccount} from '../../../client/localDomain/account';
import {LocaleTexts} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';
import {AccountService} from '../../../services/account';
import {ErrorService} from '../../../services/error';

import {AccountsEditComponent} from '../../../components/account/edit/editAccount';

@Component({
    selector: 'editAccount',
    changeDetection: ChangeDetectionStrategy.Default
})
@View({
    templateUrl: './routes/accounts/edit/editView.html',
    styleUrls: ['./routes/accounts/edit/editView.css'],
    directives: [NgIf, RouterLink, AccountsEditComponent]
})
export class AccountsEditView implements OnActivate {
    accountId:number;
    account:LocalAccount;
    accountService:AccountService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;

    constructor(accountService:AccountService, authService:AuthService, errorService:ErrorService,
                routeParams:RouteParams, router:Router) {
        var itemIdParam = routeParams.get('id');
        this.accountId = parseInt(itemIdParam);
        if (isNaN(this.accountId)) {
            this.accountId = null;
        }
        this.router = router;
        this.accountService = accountService;
        this.authService = authService;
        this.errorService = errorService;
        this.findAccount();
    }

    onActivate() {
        return this.findAccount()
            .then((account:LocalAccount)=> {
                this.account = account;
            });
    }

    findAccount():Promise<LocalAccount> {
        if (this.accountId == null) {
            var accountDef = {
                company: this.authService.getEmployeeCompany(),
                description: new LocaleTexts()
            };
            var account = NewAccount(accountDef);
            return Promise.resolve(account);
        }
        return this.accountService.get(this.accountId);
    }

    onAccountSaved(account) {
        var instruction = this.router.generate(['../List']);
        this.router.navigateByInstruction(instruction);
    }

    onCancelled() {
        var instruction = this.router.generate(['../List']);
        this.router.navigateByInstruction(instruction);
    }
}
