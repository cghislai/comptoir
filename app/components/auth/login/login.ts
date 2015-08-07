/**
 * Created by cghislai on 07/08/15.
 */

import {Component, View, formDirectives} from 'angular2/angular2';
import {AuthService} from 'services/auth';
import {ApplicationService} from 'services/application';

@Component({
    selector: "loginView"
})
@View({
    templateUrl: './components/auth/login/login.html',
    styleUrls: ['./components/auth/login/login.css'],
    directives: [formDirectives]
})
export class LoginView {
    authService:AuthService;
    appService:ApplicationService;
    login:string;
    password:string;

    error:boolean;
    errorReason:string;

    constructor(authService:AuthService, appService:ApplicationService) {
        this.authService = authService;
        this.appService = appService;
    }

    onSubmit() {
        var thisView = this;
        this.authService.login(this.login, this.password)
            .then(function (response) {
                if (response.sucess) {

                } else {
                    thisView.error = true;
                    thisView.errorReason = response.errorReaseon;
                }
            })
            .catch(function (error) {
                thisView.appService.showError(error);
            });
    }
}