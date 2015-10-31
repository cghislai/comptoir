/**
 * Created by cghislai on 31/08/15.
 */
import {Directive, Control, Binding, NG_VALIDATORS, forwardRef, StringMap} from 'angular2/angular2';

import {NumberUtils} from '../../client/utils/number';

// FIXME: will be broken with next alpha 37 (and doesn't compile right with alpha 36)

function requiredValidator(c: Control) {
    if(c.value==null || c.value.length <= 0) {
        return {
            required: true
        };
    }
    return null;
}
@Directive({
    selector: '[validate-required]',
    bindings: [new Binding(NG_VALIDATORS, {
        toAlias: forwardRef(()=>requiredValidator)
    })],
    host: {
        '[class.required]': 'true'
    }
})
export class RequiredValidator {

}


function passwordValidator(c: Control) {
    if(c.value==null || c.value.length <= 0) {
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
    bindings: [new Binding(NG_VALIDATORS, {
        toAlias: forwardRef(()=>passwordValidator)
    })]
})
export class PasswordValidator {

}


