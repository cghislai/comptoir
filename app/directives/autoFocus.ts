/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../typings/_custom.d.ts" />
import {Directive, ElementRef} from 'angular2/angular2';

// Autofocus the input field
@Directive({
    selector: 'input[autofocusselect]'
})
export class AutoFocusDirective {
    element: HTMLInputElement;

    constructor(element:ElementRef) {
        this.element = element.nativeElement;
        if ( this.element == null) {
            return;
        }
        if (this.element != null) {
            this.doFocus();
        }
    }

    doFocus() {
        this.element.focus();
        var element = this.element;
        setTimeout(function () {
            element.select();
            if (element.type == 'text') {
                element.setSelectionRange(0, element.value.length);
            }
        }, 0);
    }
}