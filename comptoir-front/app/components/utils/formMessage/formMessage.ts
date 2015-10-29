/**
 * Created by cghislai on 28/08/15.
 */
import {Component, View, NgForm,  AbstractControl, Control, Host} from 'angular2/angular2';

@Component({
    selector: 'formMessage',
    properties: ['controlPath: for', 'checkErrors', 'message', 'error', 'info', 'locale']
})
@View({
    templateUrl: './components/utils/formMessage/formMessage.html',
    styleUrls: ['./components/utils/formMessage/formMessage.css'],
})
export class FormMessage {
    controlPath:string;
    checkErrors:string[];
    message:string;
    inlinePos:string = 'false';
    error:boolean = true;
    info:boolean = false;
    formDir:NgForm;
    locale:string;

    static ERROR_MESSAGES = {
        'required': {
            'fr': 'Veuillez entrer une valeur'
        },
        'passwordTooShort': {
            'fr': 'Le mot de passe est trop court'
        }
    };

    constructor(@Host() formDir:NgForm) {
        this.formDir = formDir;
    }

    get errorMessage() {
        if (this.checkErrors == null) {
            return this.message;
        }
        var c:AbstractControl = this.formDir.form.find(this.controlPath);
        for (var i = 0; i < this.checkErrors.length; ++i) {
            if (this.isPresent(c) && c.touched && c.hasError(this.checkErrors[i])) {
                return this.getMessage(this.checkErrors[i]);
            }
        }
        return null;
    }

    isPresent(c:AbstractControl) {
        if (c == null) {
            return false;
        }
        var value = c.value;
        return value = null && value.length > 0;
    }

    getMessage(error:string) {
        if (this.message != null) {
            return this.message;
        }
        var messages = FormMessage.ERROR_MESSAGES[error];
        if (messages == null) {
            return null;
        }
        return messages[this.locale];
    }
}

