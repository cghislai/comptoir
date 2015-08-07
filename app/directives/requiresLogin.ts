/**
 * Created by cghislai on 07/08/15.
 */
import {Directive} from 'angular2/angular2';
import {Router, Location} from 'angular2/router';

import {AuthService} from 'services/auth';

@Directive({selector: '[requireslogin]'})
export class RequiresLogin {

    router: Router;
    location: Location;
    authService: AuthService;

    constructor(location: Location, router: Router, authservice: AuthService) {
        this.location = location;
        this.router = router;
        this.authService = authservice;

        var path = location.path();
        if (path.indexOf('/login') >= 0) {
            return;
        }
        // Check if loggedin
        var loggedIn = authservice.isLoggedIn();
        if (loggedIn) {
            return;
        }
        router.navigate('/login');
    }
}
