/**
 * Created by cghislai on 07/08/15.
 */
import {Directive, ElementRef, NgIf} from 'angular2/angular2';
import {Router, Location} from 'angular2/router';

import {AuthService} from 'services/auth';

@Directive({
    selector: '[requireslogin]',
    properties: ['requiresLogin']
})
export class RequiresLogin {
    location: Location;
    router:Router;
    authService:AuthService;
    requiresLogin: boolean;

    constructor(router:Router, location:Location, authService:AuthService,
                elementRef:ElementRef) {
        this.router = router;
        this.location = location;
        this.authService = authService;
        var thisDirective = this;
        router.subscribe(function (path) {
            thisDirective.checkNewPath(path);
        });
        this.checkNewPath(location.path());
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
        this.requiresLogin = loginRequired;
        if (loginRequired) {
            this.router.navigate('/login');
        }
    }
}
