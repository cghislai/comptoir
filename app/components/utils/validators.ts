/**
 * Created by cghislai on 31/08/15.
 */
import {Directive, provide} from 'angular2/core';
import {Control, NG_VALIDATORS} from 'angular2/common';

@Directive({
    selector: '[validate-required]',
    providers: [provide(NG_VALIDATORS, {
        useExisting: RequiredValidator,
        multi: true
    })],
    host: {
        '[class.required]': 'true'
    }
})
export class RequiredValidator {
    validate(c: Control) {
        if(c.value == null || c.value.length <= 0) {
            return {
                'required': true
            };
        }
        return null;
    }
}


@Directive({
    selector: '[validate-password]',
    providers: [provide(NG_VALIDATORS, {
        useExisting: PasswordValidator,
        multi: true
    })]
})
export class PasswordValidator {
    validate(c: Control) {
        if(c.value == null || c.value.length <= 0) {
            return null;
        }
        var password = c.value;
        if (password.length < 6) {
            return {'passwordTooShort': true};
        }
        return null;
    }
}


