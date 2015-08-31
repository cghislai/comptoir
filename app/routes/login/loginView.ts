/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View, FormBuilder, FORM_DIRECTIVES, ControlGroup} from 'angular2/angular2';
import {Router, RouterLink} from 'angular2/router';

import {AppHeader} from 'components/app/header/appHeader';
import {AppContent} from 'components/app/content/appContent';
import {FormMessage} from 'components/utils/formMessage/formMessage';
import {requiredValidator} from 'components/utils/validators';

import {AuthService, LoginRequiredReason} from 'services/auth';
import {ErrorService} from 'services/error';
import {MD5} from 'components/utils/md5';



@Component({
    selector: "loginView",
    viewBindings: [FormBuilder]
})
@View({
    templateUrl: './routes/login/loginView.html',
    styleUrls: ['./routes/login/loginView.css'],
    directives: [FORM_DIRECTIVES, RouterLink, AppHeader, AppContent, FormMessage]
})
export class LoginView {
    authService:AuthService;
    errorService: ErrorService;
    router: Router;

    loginForm: ControlGroup;
    introText:string;

    invalidCredentials: boolean;

    // TODO: RouteData for introText
    constructor(authService:AuthService,
                errorService: ErrorService,
                router:Router,
                formBuilder: FormBuilder) {
        this.authService = authService;
        this.errorService = errorService;
        this.router = router;
        this.buildForm(formBuilder);
    }

    buildForm(formBuilder: FormBuilder) {

        this.loginForm = formBuilder.group({
            'login': ["", requiredValidator],
            'password': ["", requiredValidator]
        });
    }

    doLogin(event) {
        var login = this.loginForm.value.login;
        var password = this.loginForm.value.password;

        var hashedPassword = MD5.encode(password);
        var thisView = this;

        this.authService.login(login, hashedPassword)
            .then(function (employee) {
                thisView.router.navigate('/sales/active');
            }).catch(function (error) {
                if(error.code == 401) {
                    thisView.invalidCredentials = true;
                    return;
                } else if (error.code == 404)  {
                    thisView.invalidCredentials = true;
                    return;
                }
                thisView.errorService.handleRequestError(error);
            });
    }
}