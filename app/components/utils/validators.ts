/**
 * Created by cghislai on 31/08/15.
 */
import {Directive, Control, Provider, NG_VALIDATORS} from 'angular2/angular2';

function requiredValidator(c: Control) {
    if(c.value === null || c.value.length <= 0) {
        return {
            required: true
        };
    }
    return null;
}
@Directive({
    selector: '[validate-required]',
    bindings: [new Provider(NG_VALIDATORS, {
        useValue: requiredValidator,
        multi: true
    })],
    host: {
        '[class.required]': 'true'
    }
})
export class RequiredValidator {

}


function passwordValidator(c: Control) {
    if(c.value === null || c.value.length <= 0) {
        return null;
    }
    var password = c.value;
    if (password.length < 6) {
        return {passwordTooShort: true};
    }
    return null;
}

@Directive({
    selector: '[validate-password]',
    bindings: [new Provider(NG_VALIDATORS, {
        useValue: passwordValidator,
        multi: true
    })]
})
export class PasswordValidator {

}


