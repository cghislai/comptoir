/**
 * Created by cghislai on 07/08/15.
 */
import {Directive, ElementRef, NgIf, EventEmitter} from 'angular2/angular2';
import {Router, Location, Instruction} from 'angular2/router';

import {AuthService} from 'services/auth';

@Directive({
    selector: '[requireslogin]',
    properties: ['requiresLogin'],
    events: ['requiresLogin']
})
export class RequiresLogin {
    location: Location;
    router:Router;
    authService:AuthService;
    requiresLogin= new EventEmitter();

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
            this.requiresLogin.next(false);
            return;
        }
        if (path.indexOf('/register') >= 0) {
            this.requiresLogin.next(false);
            return;
        }
        // Check if logged-in
        var loginRequired = this.authService.checkLoginRequired();
        this.requiresLogin.next(loginRequired);
        if (loginRequired) {
            this.router.navigate('/login');
        }
    }
}
