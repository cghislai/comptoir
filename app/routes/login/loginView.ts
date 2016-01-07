/**
 * Created by cghislai on 28/08/15.
 */

import {Component} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {Router, RouterLink} from 'angular2/router';

import {AppHeader} from '../../components/app/header/appHeader';
import {FormMessage} from '../../components/utils/formMessage/formMessage';
import {RequiredValidator} from '../../components/utils/validators';

import {AuthService} from '../../services/auth';
import {ErrorService} from '../../services/error';
import {MD5} from '../../components/utils/md5';



@Component({
    selector: "login-view",
    templateUrl: './routes/login/loginView.html',
    styleUrls: ['./routes/login/loginView.css'],
    directives: [FORM_DIRECTIVES, RouterLink, AppHeader, FormMessage, RequiredValidator]
})
export class LoginView {
    authService:AuthService;
    errorService: ErrorService;
    router: Router;

    login: string;
    password: string;
    introText:string;

    invalidCredentials: boolean;

    // TODO: RouteData for introText
    constructor(authService:AuthService,
                errorService: ErrorService,
                router:Router) {
        this.authService = authService;
        this.errorService = errorService;
        this.router = router;
    }


    doLogin(event) {
        var hashedPassword = MD5.encode(this.password);
        var thisView = this;

        this.authService.login(this.login, hashedPassword)
            .then(function (employee) {
                thisView.router.navigate(['/Sales/Sale', {id: 'active'}]);
            }).catch(function (error) {
                if(error.code === 401) {
                    thisView.invalidCredentials = true;
                    return;
                } else if (error.code === 404)  {
                    thisView.invalidCredentials = true;
                    return;
                }
                thisView.errorService.handleRequestError(error);
            });
    }
}
