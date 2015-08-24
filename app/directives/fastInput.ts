/**
 * Created by cghislai on 23/08/15.
 */

import {Directive, ElementRef, EventEmitter,
    Observable, Attribute} from 'angular2/angular2';

@Directive({
    selector: 'input[fast-input]',
    properties: ['validator'],
    events: ['fastChange'],
    host: {
        '(keyup)': 'onKeyUp($event)',
        '(input)': 'onInput($event)',
        '(blur)': 'onBlur($event)'
    }
})
export class FastInput {
    validator:(any)=>boolean;
    fastChange:EventEmitter;
    initialValue:any;
    elementRef:ElementRef;

    constructor(elementRef:ElementRef) {
        this.elementRef = elementRef;
        this.initialValue = elementRef.nativeElement.value;
        this.fastChange = new EventEmitter();
        this.doFocus();
    }

    doFocus() {
        var element = this.elementRef.nativeElement;
        element.focus();
        setTimeout(function () {
            element.select();
            if (element.type == 'text') {
                element.setSelectionRange(0, element.value.length);
            }
        }, 0);
    }

    onKeyUp(event) {
        if (event.which == 13) { // Enter
            this.doValidate();
            return false;
        }
        if (event.which == 27) { // Escape
            this.doCancel();
            return false;
        }
        return false;
    }

    onInput(event) {
        var value = event.target.value;
        if (this.validator != null) {
            var valid = this.validator(value);
            if (!valid) {
                return false;
            }
        }
        return true;
    }

    onBlur(event) {
        this.doValidate();
        return true;
    }

    doValidate() {
        var value = this.elementRef.nativeElement.value;
        if (this.validator != null) {
            var valid = this.validator(value);
            if (!valid) {
                this.elementRef.nativeElement.select();
                return;
            }
        }
        this.fastChange.next(value);
    }

    doCancel() {
        this.elementRef.nativeElement.value = this.initialValue;
        this.fastChange.next(this.initialValue);
    }
}