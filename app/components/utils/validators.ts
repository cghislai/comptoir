/**
 * Created by cghislai on 31/08/15.
 */
import {Control} from 'angular2/angular2';

export function requiredValidator(c: Control) {
    if(c.value==null || c.value.trim().length <= 0) {
        return {
            required: true
        };
    }
    return null;
}

export function passwordValidator(c: Control) {
    if(c.value==null || c.value.length <= 0) {
        return null;
    }
    var password = c.value;
    if (password.length < 6) {
        return {passwordTooShort: true};
    }
    return null;
}
