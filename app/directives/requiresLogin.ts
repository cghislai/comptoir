/**
 * Created by cghislai on 07/08/15.
 */
import {Directive} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {AuthService} from 'services/auth';

@Directive({selector: '[requireslogin]'})
export class RequiresLogin {

    router:Router;
    location:Location;
    authService:AuthService;

    constructor(router:Router, authService:AuthService) {
        this.router = router;
        this.authService = authService;
        var thisDirective = this;
        router.subscribe(function (path) {
            thisDirective.checkNewPath(path);
        });

    }

    checkNewPath(path:string) {
        if (path.indexOf('/login') >= 0) {
            return;
        }
        if (path.indexOf('/register') >= 0) {
            return;
        }
        // Check if loggedin
        var loginRequired = this.authService.checkLoginRequired();
        if (loginRequired) {
            this.router.navigate('/login');
        }
    }
}
