/**
 * Created by cghislai on 31/08/15.
 */
import {Directive, Control, Binding, NgValidator, forwardRef} from 'angular2/angular2';

import {NumberUtils} from 'client/utils/number';

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
    //bindings: [new Binding(NgValidator, {
      //  toAlias: forwardRef(()=>RequiredValidator)
    //})]
})
export class RequiredValidator {
    get validator() {
        return RequiredValidator.validate;
    }
    static validate(c): StringMap<string, boolean> {
        return requiredValidator(c);
    }
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
    //bindings: [new Binding(NgValidator, {
       // toAlias: forwardRef(()=>PasswordValidator)
    //})]
})
export class PasswordValidator {
    get validator() { return PasswordValidator.validate; }
    static validate(c: Control): StringMap<string, boolean> {
        return passwordValidator(c);
    }
}


