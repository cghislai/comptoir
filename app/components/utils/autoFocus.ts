/**
 * Created by cghislai on 29/07/15.
 */
import {Directive, ElementRef} from 'angular2/core';

// Autofocus the input field
@Directive({
    selector: '[select-on-focus]',
    host: {
        '(focus)': 'doSelect()'
    }
})
export class AutoFocusDirective {
    element: HTMLInputElement;

    constructor(element:ElementRef) {
        this.element = element.nativeElement;
        if ( this.element == null) {
            return;
        }
    }

    doFocus() {
        this.element.focus();
        this.doSelect();
    }

    doSelect() {
        var element = this.element;
        setTimeout(function () {
            element.select();
            if (element.type === 'text') {
                element.setSelectionRange(0, element.value.length);
            }
        }, 0);
    }
}