/**
 * Created by cghislai on 28/08/15.
 */

import {Component, View, FormBuilder, FORM_DIRECTIVES, ControlGroup, Control} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {AppHeader} from 'components/app/header/appHeader';
import {AppContent} from 'components/app/content/appContent';
import {FormMessage} from 'components/utils/formMessage/formMessage';
import {AuthService, LoginRequiredReason} from 'services/auth';
import {ApplicationService} from 'services/application';
import {MD5} from 'components/auth/md5';

function requiredValidator(c: Control) {
    if(c.value==null || c.value.trim().length <= 0) {
        return {
            required: true
        };
    }
    return null;
}

@Component({
    selector: "loginView",
    viewBindings: [FormBuilder]
})
@View({
    templateUrl: './routes/login/loginView.html',
    styleUrls: ['./routes/login/loginView.css'],
    directives: [FORM_DIRECTIVES, AppHeader, AppContent, FormMessage]
})
export class LoginView {
    authService:AuthService;
    appService:ApplicationService;
    router: Router;

    loginForm: ControlGroup;
    introText:string;

    invalidCredentials: boolean;

    // TODO: RouteData for introText
    constructor(authService:AuthService,
                appService:ApplicationService,
                router:Router,
                formBuilder: FormBuilder) {
        this.authService = authService;
        this.appService = appService;
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
                thisView.router.navigate('/sales');
            }).catch(function (error) {
                if(error.code == 401) {
                    thisView.invalidCredentials = true;
                    return;
                }
                thisView.appService.handleRequestError(error);
            });
    }
}