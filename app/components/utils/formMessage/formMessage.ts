/**
 * Created by cghislai on 28/08/15.
 */
import {Component, View, Form, Control} from 'angular2/angular2';

@Component({
    selector: 'formMessage',
    properties: ['control: for', 'error', 'message', 'inline']
})
@View({
    templateUrl: './components/utils/formMessage/formMessage.html',
    styleUrls: ['./components/utils/formMessage/formMessage.css']
})
export class FormMessage {
    control: Control;
    error: string;
    message: string;
    inline: boolean;

    constructor() {
    }

    shouldDisplay() {
        if (this.error == null) {
            return true;
        }
        return this.control.touched
        && this.control.hasError(this.error);
    }
}

